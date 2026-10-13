# API Integration Contract (ĐỀ XUẤT — chưa chốt)

> Mọi endpoint, DTO, enum dưới đây là **đề xuất phía frontend** để dựng UI. Mock **không phải** hợp đồng chính thức.
> Khi `packages/shared` có contract chính thức, thay các type trong `src/features/*/types.ts` bằng import từ đó.

## Kiến trúc tích hợp

```
Page/Component ─▶ hooks (TanStack Query) ─▶ features/<x>/api.ts ─┬─▶ <x>Http   (services/http/httpClient)
                                                                └─▶ <x>Mock   (mocks/handlers/<x>.mock.ts)
```

- Chọn implementation bằng `VITE_USE_MOCK_API` trong `src/lib/env.ts`. Khi tích hợp **chỉ sửa phần `*Http`** (đường dẫn, map DTO), không sửa UI.
- **Auth (theo hướng backend):**
  - Access token JWT ngắn hạn giữ **trong memory** (`services/http/accessToken.ts`), gửi qua header `Authorization: Bearer <token>`.
  - Refresh token là **cookie HttpOnly** do backend set; frontend không đọc và không lưu.
  - Mọi request gửi `credentials: 'include'`.
- **Khi gặp 401:**
  - `httpClient` gọi refresh **một lần**. Nhiều request 401 đồng thời dùng chung một lần refresh (single-flight).
  - Refresh thành công: gửi lại request gốc đúng một lần.
  - Refresh thất bại: xóa token, UI hiện hộp thoại hết phiên.
  - Khi tải lại trang, `authApi.me()` refresh trước để khôi phục phiên.
- **Endpoint/DTO auth DỰ KIẾN (chưa chốt):**
  - `POST /auth/login`, `POST /auth/register` → `{ accessToken, user }`
  - `POST /auth/refresh` (cookie) → `{ accessToken }` + rotate cookie
  - `POST /auth/logout` → xóa cookie
  - `GET /auth/me` → `CurrentUser`

  Nếu backend khác, chỉ cần sửa `features/auth/api.ts` và `REFRESH_PATH` trong `services/http/httpClient.ts`.
- Lỗi được chuẩn hóa thành `ApiError { status, message, code?, fieldErrors? }`. Lỗi 401 phát sự kiện "hết phiên", UI hiện hộp thoại đăng nhập lại.

### Error envelope mong đợi

```json
{ "statusCode": 400, "message": "Thông tin không hợp lệ", "code": "VALIDATION_ERROR", "fieldErrors": { "endDate": "..." } }
```

### Phân trang (marketplace)

`GET ?page=1&pageSize=6` → `{ items, page, pageSize, total }`. Các danh sách trong workspace hiện chưa phân trang phía server (cần chốt).

## Endpoint dự kiến (prefix `/api/v1`)

| Domain | Method & path | Dùng ở |
|---|---|---|
| Auth | `GET /auth/me` (401 → null), `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `POST /auth/forgot-password`, `PATCH /users/me` | AUTH-*, USR-01 |
| Marketplace | `GET /marketplace/rooms`, `GET /marketplace/rooms/:id`, `GET /marketplace/rooms/featured`, `GET /marketplace/stats`, `GET /marketplace/districts` | PUB-* |
| Viewings (user) | `POST /viewings`, `GET /viewings/me`, `POST /viewings/:id/cancel` | PUB-05, USR-02 |
| Notifications | `GET /notifications`, `POST /notifications/:id/read`, `POST /notifications/read-all` | USR-03 |
| Workspaces | `GET /workspaces/me`, `GET /workspaces/:ws/dashboard`, `GET/PATCH /workspaces/:ws/settings` | USR-04, WSP-01/02 |
| Members | `GET/POST /workspaces/:ws/members`, `PATCH/DELETE /workspaces/:ws/members/:id` | WSP-03 |
| Buildings | `GET/POST /workspaces/:ws/buildings`, `GET/PATCH /workspaces/:ws/buildings/:id` | BLD-* |
| Rooms | `GET/POST /workspaces/:ws/rooms`, `GET/PATCH /workspaces/:ws/rooms/:id`, `PATCH /workspaces/:ws/rooms/:id/listing` | ROOM-* |
| Viewings (ws) | `GET /workspaces/:ws/viewings`, `PATCH /workspaces/:ws/viewings/:id` | VIEW-01 |
| Tenants | `GET/POST /workspaces/:ws/tenants`, `GET/PATCH /workspaces/:ws/tenants/:id`, `POST …/tenants/:id/link-request/{approve|reject}` | TEN-* |
| Contracts | `GET/POST /workspaces/:ws/contracts`, `GET/PATCH …/:id`, `POST …/:id/activate`, `POST …/:id/terminate` | CTR-* |
| Vehicles | `GET/POST /workspaces/:ws/vehicles`, `PATCH/DELETE …/:id` | VEH-01 |
| Rates | `GET/POST /workspaces/:ws/rates` | RATE-01 |
| Meters | `GET /workspaces/:ws/meter-readings?period=`, `POST /workspaces/:ws/meter-readings` | METER-01 |
| Invoices | `GET /workspaces/:ws/invoices`, `GET …/:id`, `POST …/:id/adjustments` | INV-01/02 |
| Billing run | `POST /workspaces/:ws/billing/preview {period}`, `POST /workspaces/:ws/billing/run {period, contractIds}` | INV-03 |
| Payments | `GET /workspaces/:ws/payments`, `POST …/payments`, `POST …/:id/confirm`, `POST …/:id/reject` | PAY-01 |
| Deposits | `GET/POST /workspaces/:ws/deposits` | DEP-01 |
| Maintenance | `GET/POST /workspaces/:ws/maintenance`, `GET/PATCH …/:id`, `POST …/:id/comments` | MNT-* |
| Reports | `GET /workspaces/:ws/reports?from=&to=` | RPT-01 |
| Tenant portal | `GET /tenant/overview`, `/tenant/contracts`, `/tenant/invoices`, `/tenant/invoices/:id`, `POST /tenant/payments`, `GET/POST /tenant/maintenance`, `GET/POST /tenant/link-requests` | TPT-* |
| Admin | `GET /admin/overview`, `GET/PATCH /admin/users`, `GET/PATCH /admin/workspaces`, `GET/PATCH /admin/listings`, `GET /admin/audit-logs` | ADM-* |

## Enum đang dùng

| Enum | Giá trị |
|---|---|
| GlobalRole | `USER`, `ADMIN` (không có `LANDLORD`) |
| WorkspaceRole | `OWNER`, `MANAGER`, `STAFF` |
| WorkspaceStatus | `ACTIVE`, `SUSPENDED` |
| OperationalStatus (phòng) | `VACANT`, `OCCUPIED`, `RESERVED`, `MAINTENANCE` |
| ListingStatus (tin) | `DRAFT`, `PUBLISHED`, `HIDDEN` |
| ViewingStatus | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED` |
| AccountLinkStatus | `UNLINKED`, `PENDING`, `LINKED` |
| ContractStatus | `DRAFT`, `ACTIVE`, `ENDED`, `TERMINATED` |
| WaterMode | `PER_PERSON`, `METER` |
| InvoiceStatus | `DRAFT`, `ISSUED`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `VOID` |
| PaymentStatus | `PENDING`, `CONFIRMED`, `REJECTED` |
| PaymentMethod | `CASH`, `BANK_TRANSFER` |
| DepositTxType | `COLLECT`, `REFUND`, `DEDUCT` |
| MaintenanceStatus | `OPEN`, `IN_PROGRESS`, `RESOLVED` |
| MaintenancePriority | `URGENT`, `MEDIUM`, `LOW` |

Định dạng: ngày `yyyy-MM-dd`, kỳ `yyyy-MM`, thời điểm ISO-8601 UTC, tiền là **số nguyên VND**.

## Logic đang mô phỏng ở mock (backend phải là nguồn chính thức)

- Proration tiền phòng theo ngày (`features/billing/calc.ts`): `round(rent × ngày hiệu lực / số ngày của tháng)`.
- Nước theo người: số người ở vào **ngày cuối kỳ**; nếu hợp đồng kết thúc trước ngày cuối kỳ thì tính 0 người.
- Hóa đơn lưu snapshot dòng phí + `rateVersionId`; điều chỉnh là bản ghi riêng có người thực hiện/thời gian/lý do.
- Trạng thái hóa đơn suy ra từ `paidConfirmed` (chỉ gồm thanh toán CONFIRMED) và hạn nộp.
- Kích hoạt hợp đồng trả 409 nếu trùng ACTIVE; khi kích hoạt thì ghi nhận cọc và chuyển phòng sang `OCCUPIED`.
- Liên kết tenant: mã mời + mã HĐ + SĐT khớp người đứng tên + OTP → `PENDING`, sau đó chủ trọ duyệt mới thành `LINKED`.

## Câu hỏi mở (cần chốt trước khi tích hợp)

1. **Error envelope / pagination / filter** chuẩn cho mọi danh sách; danh sách workspace có phân trang server không?
2. **Auth:** đăng nhập bằng email hay SĐT hay cả hai; chính sách cookie (SameSite, domain), CSRF token, refresh flow, thời hạn phiên.
3. **Khách chưa đăng nhập** có được đặt lịch xem không (spec ghi "theo chính sách")? Hiện UI cho phép.
4. **Map provider** (Google/Mapbox/OSM) + có lọc theo bounding box không.
5. **Upload ảnh:** presigned URL hay multipart; giới hạn dung lượng; xử lý EXIF. Hiện chỉ preview cục bộ.
6. **Làm tròn tiền** (đồng / nghìn đồng), công thức prorate, làm tròn từng dòng hay tổng.
7. **Nước theo người** khi hợp đồng kết thúc giữa kỳ hoặc người ở thay đổi trong kỳ.
8. **Hóa đơn điều chỉnh**: điều chỉnh trên hóa đơn hay phát hành hóa đơn điều chỉnh riêng; quy tắc khóa chỉ số sau khi phát hành.
9. **Xác minh liên kết tenant**: OTP gửi qua kênh nào; mã mời cấp theo workspace hay theo hợp đồng.
10. **Permission matrix** chính thức (hiện là bảng đề xuất trong `features/workspaces/types.ts`).
11. **Dashboard**: một endpoint tổng hợp hay frontend gộp nhiều endpoint.
12. Hành vi khi workspace bị `SUSPENDED` (chỉ đọc hay chặn hoàn toàn).
