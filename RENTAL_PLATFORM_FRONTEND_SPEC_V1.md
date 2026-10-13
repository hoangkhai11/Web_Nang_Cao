# RENTAL PLATFORM V1.0 — ĐẶC TẢ FRONTEND & DANH SÁCH MÀN HÌNH

> Phiên bản: 1.0 · Ngày: 13/10/2026 · Trạng thái: Tài liệu giao việc cho nhóm frontend
>
> Mục tiêu: Phát triển giao diện React độc lập, có thể tích hợp vào `apps/web` của monorepo Rental Platform mà không cần backend hoàn thành.

## 1. Phạm vi và nguyên tắc phối hợp

- **Frontend:** React + Vite + TypeScript, React Router, TanStack Query; responsive ưu tiên mobile; dùng design tokens.
- **Backend chính:** NestJS REST API `/api/v1`, TypeORM, PostgreSQL/Neon; đang được phát triển riêng.
- Người làm frontend **không sửa backend, không tự thay stack, không tạo microservices**.
- Sử dụng mock service và dữ liệu giả khi API chưa sẵn sàng; không hardcode mock data trực tiếp trong page/component.
- Khi tích hợp, thay implementation của service/API adapter, không viết lại UI.
- Không đưa secrets vào frontend. Không lưu refresh token trong localStorage.
- Không tự nhận rằng các chức năng như thanh toán hay gửi thông báo đã hoạt động thật khi chỉ đang dùng mock.
- **Không chỉnh sửa chung một thư mục/nhánh với Codex backend.** Làm trên nhánh `feat/frontend-v1` hoặc repo frontend độc lập; khi ghép đưa vào `apps/web`.

## 2. Vai trò và layout

| Nhóm | Quyền truy cập giao diện | Layout |
|---|---|---|
| Khách chưa đăng nhập | Xem/tìm phòng, chi tiết phòng, đăng nhập/đăng ký, gửi yêu cầu xem phòng theo chính sách | PublicLayout |
| USER | Hồ sơ, lịch xem phòng, thông báo | UserLayout |
| OWNER / MANAGER / STAFF | Quản lý workspace theo permission matrix từ backend | WorkspaceLayout |
| Tenant đã liên kết tài khoản | Xem hợp đồng, hóa đơn, thanh toán, bảo trì thuộc hợp đồng của mình | TenantLayout |
| ADMIN | Quản trị nền tảng: tài khoản, kiểm duyệt tin đăng, khiếu nại, thống kê tổng hợp, cấu hình chung. **Không** sửa dữ liệu tài chính/nghiệp vụ của chủ trọ (xem `docs/business/ROLE_PERMISSIONS.md`) | AdminLayout |

**Lưu ý:** `LANDLORD` không phải global role. Quyền quản lý xuất phát từ membership của workspace. Tenant có thể được chủ trọ tạo hồ sơ trước khi liên kết với User.

## 3. Danh sách màn hình cần xây dựng

Trạng thái ưu tiên: **P0** = nền tảng/MVP flow, **P1** = hoàn thiện V1.0, **PROPOSED** = đề xuất nghiệp vụ chưa được Product Owner duyệt (không triển khai khi chưa duyệt). Đường dẫn là đề xuất và cần đối chiếu API/router hiện hữu khi tích hợp.

### 3.1. Public / Marketplace

| ID | Route | Màn hình | Nội dung chính | Ưu tiên |
|---|---|---|---|---|
| PUB-01 | `/` | Trang chủ | Hero tìm kiếm, phòng nổi bật, CTA đăng tin/quản lý | P0 |
| PUB-02 | `/rooms` | Danh sách phòng | Tìm kiếm, bộ lọc giá/diện tích/khu vực/tiện ích, sắp xếp, phân trang | P0 |
| PUB-03 | `/rooms/:roomId` | Chi tiết phòng | Ảnh, giá, phí, tiện ích, vị trí, thông tin chủ trọ, CTA đặt lịch | P0 |
| PUB-04 | `/rooms/map` | Tìm phòng trên bản đồ | Map + danh sách đồng bộ, lọc theo vùng nhìn thấy, trạng thái loading/empty | P1 |
| PUB-05 | `/rooms/:roomId/viewing` | Đặt lịch xem phòng | Chọn thời gian đề xuất, liên hệ, xác nhận, validation | P0 |
| PUB-06 | `/about` | Giới thiệu | Sản phẩm, đối tượng sử dụng | P1 |
| PUB-07 | `/help` | Trợ giúp | FAQ, hướng dẫn, liên hệ | P1 |
| PUB-02+ | `/rooms` | Mở rộng bộ lọc | Lọc/sắp xếp theo **khoảng cách** đến địa điểm (bán kính đường thẳng hoặc thời gian di chuyển) và theo **đánh giá** (từ N★, số đánh giá tối thiểu); thẻ phòng hiển thị khoảng cách, thời gian, điểm đánh giá | PROPOSED |
| PUB-03+ | `/rooms/:roomId` | Mở rộng chi tiết | Khối khoảng cách tới địa điểm người dùng chọn, khối đánh giá + phản hồi chủ trọ, chi phí ước tính/tháng | PROPOSED |
| PUB-08 | `/rooms/smart-search` | Trợ lý tìm trọ thông minh | Wizard: địa điểm, ngân sách + chế độ ngân sách, phương tiện + thời gian tối đa, tiện ích bắt buộc → kết quả xếp hạng + bản đồ + “Vì sao đề xuất?” + nới điều kiện chủ động | PROPOSED (P04-B) |

### 3.2. Authentication / User

| ID | Route | Màn hình | Nội dung chính | Ưu tiên |
|---|---|---|---|---|
| AUTH-01 | `/login` | Đăng nhập | Email/điện thoại theo phương thức đã chốt, mật khẩu, lỗi | P0 |
| AUTH-02 | `/register` | Đăng ký | Form, validation, điều khoản | P0 |
| AUTH-03 | `/forgot-password` | Quên mật khẩu | UI dự kiến; đánh dấu phụ thuộc API/reset flow | P1 |
| USR-01 | `/account` | Hồ sơ | Thông tin cá nhân, cập nhật hồ sơ | P0 |
| USR-02 | `/my-viewings` | Lịch xem phòng | PENDING/CONFIRMED/COMPLETED/CANCELLED, hủy nếu được phép | P0 |
| USR-03 | `/notifications` | Thông báo | Danh sách, trạng thái đã đọc | P1 |
| USR-04 | `/workspaces/select` | Chọn workspace | Workspace tham gia, chuyển workspace | P0 |

### 3.3. Landlord / Workspace Management

| ID | Route | Màn hình | Nội dung chính | Ưu tiên |
|---|---|---|---|---|
| WSP-01 | `/w/:workspaceId/dashboard` | Dashboard | Tổng phòng, đang thuê, công nợ, lịch hẹn, yêu cầu bảo trì | P0 |
| WSP-02 | `/w/:workspaceId/settings` | Cài đặt workspace | Tên, trạng thái, thông tin quản lý | P0 |
| WSP-03 | `/w/:workspaceId/members` | Thành viên & phân quyền | Danh sách, thêm, sửa role, khóa/xóa theo quyền | P0 |
| BLD-01 | `/w/:workspaceId/buildings` | Danh sách tòa nhà | Bảng/card, tìm kiếm, tạo mới | P0 |
| BLD-02 | `/w/:workspaceId/buildings/new` | Tạo tòa nhà | Thông tin, địa chỉ, tọa độ | P0 |
| BLD-03 | `/w/:workspaceId/buildings/:buildingId` | Chi tiết tòa nhà | Tổng quan, phòng, tỷ lệ lấp đầy, cấu hình | P0 |
| BLD-04 | `/w/:workspaceId/buildings/:buildingId/edit` | Sửa tòa nhà | Form cập nhật | P0 |
| ROOM-01 | `/w/:workspaceId/rooms` | Danh sách phòng | Trạng thái vận hành/đăng tin tách biệt, lọc | P0 |
| ROOM-02 | `/w/:workspaceId/rooms/new` | Tạo phòng | Tòa nhà, mã phòng, giá, diện tích, tiện ích, ảnh | P0 |
| ROOM-03 | `/w/:workspaceId/rooms/:roomId` | Chi tiết phòng | Thông tin, hợp đồng hiện tại, lịch sử, trạng thái listing | P0 |
| ROOM-04 | `/w/:workspaceId/rooms/:roomId/edit` | Sửa phòng | Form, ảnh, tiện ích, trạng thái đăng tin | P0 |
| VIEW-01 | `/w/:workspaceId/viewings` | Quản lý lịch xem | Danh sách/lịch, xác nhận, hoàn thành, hủy | P0 |
| TEN-01 | `/w/:workspaceId/tenants` | Danh sách người thuê | Tìm kiếm, lọc, trạng thái liên kết tài khoản | P0 |
| TEN-02 | `/w/:workspaceId/tenants/new` | Tạo hồ sơ người thuê | Thông tin liên hệ; không tự liên kết bằng số điện thoại | P0 |
| TEN-03 | `/w/:workspaceId/tenants/:tenantId` | Chi tiết người thuê | Hồ sơ, hợp đồng, phương tiện, yêu cầu liên kết | P0 |
| CTR-01 | `/w/:workspaceId/contracts` | Danh sách hợp đồng | Trạng thái, phòng, người thuê, thời hạn | P0 |
| CTR-02 | `/w/:workspaceId/contracts/new` | Tạo hợp đồng | Phòng, người thuê, startDate/endDate, tiền thuê/cọc | P0 |
| CTR-03 | `/w/:workspaceId/contracts/:contractId` | Chi tiết hợp đồng | Người ở, kỳ hạn, tiền cọc, lịch sử, trạng thái | P0 |
| CTR-04 | `/w/:workspaceId/contracts/:contractId/edit` | Sửa hợp đồng nháp | Form có giới hạn theo trạng thái | P0 |
| VEH-01 | `/w/:workspaceId/vehicles` | Quản lý phương tiện | Danh sách xe, người sở hữu, biển số, phí | P1 |
| RATE-01 | `/w/:workspaceId/rates` | Bảng giá dịch vụ | Phiên bản đơn giá theo effectiveFrom | P0 |
| METER-01 | `/w/:workspaceId/meters` | Ghi chỉ số điện nước | Chọn kỳ, phòng, số cũ/mới, validation | P0 |
| INV-01 | `/w/:workspaceId/invoices` | Danh sách hóa đơn | Kỳ, trạng thái, tổng tiền, đã thu, còn nợ | P0 |
| INV-02 | `/w/:workspaceId/invoices/:invoiceId` | Chi tiết hóa đơn | Snapshot khoản phí, điều chỉnh có audit, lịch sử thu | P0 |
| INV-03 | `/w/:workspaceId/billing/run` | Lập hóa đơn tháng | Chọn kỳ, xem trước, xác nhận, kết quả từng hợp đồng | P0 |
| PAY-01 | `/w/:workspaceId/payments` | Xác nhận thanh toán | Tiền mặt/chuyển khoản, bằng chứng, partial payment | P0 |
| DEP-01 | `/w/:workspaceId/deposits` | Giao dịch tiền cọc | Thu/hoàn/khấu trừ cọc; tách khỏi doanh thu thuê | P1 |
| MNT-01 | `/w/:workspaceId/maintenance` | Yêu cầu bảo trì | OPEN/IN_PROGRESS/RESOLVED, lọc, phân công | P1 |
| MNT-02 | `/w/:workspaceId/maintenance/:id` | Chi tiết bảo trì | Mô tả, ảnh, trạng thái, trao đổi | P1 |
| RPT-01 | `/w/:workspaceId/reports` | Báo cáo | Doanh thu đã xác nhận, công nợ, lấp đầy, bộ lọc thời gian | P1 |

### 3.4. Tenant Portal

| ID | Route | Màn hình | Nội dung chính | Ưu tiên |
|---|---|---|---|---|
| TPT-01 | `/tenant` | Tổng quan người thuê | Phòng đang thuê, hóa đơn gần nhất, thông báo | P0 |
| TPT-02 | `/tenant/contracts` | Hợp đồng của tôi | Danh sách và chi tiết hợp đồng liên kết hợp lệ | P0 |
| TPT-03 | `/tenant/invoices` | Hóa đơn của tôi | Kỳ, tổng tiền, còn nợ, trạng thái | P0 |
| TPT-04 | `/tenant/invoices/:invoiceId` | Chi tiết hóa đơn | Các khoản phí, đã thanh toán, chứng từ | P0 |
| TPT-05 | `/tenant/payments/new` | Gửi thông tin thanh toán | Số tiền, phương thức, minh chứng; chờ chủ trọ xác nhận | P0 |
| TPT-06 | `/tenant/maintenance` | Yêu cầu bảo trì | Danh sách, tạo mới, theo dõi tiến độ | P1 |
| TPT-07 | `/tenant/link-account` | Liên kết hồ sơ thuê | Gửi/xác nhận yêu cầu liên kết có xác minh | P0 |
| TPT-08 | `/tenant/reviews` | Đánh giá phòng đã thuê | Viết/sửa (trong thời hạn) đánh giá cho hợp đồng đủ điều kiện; mỗi hợp đồng 1 đánh giá | PROPOSED |

### 3.5. Platform Admin

| ID | Route | Màn hình | Nội dung chính | Ưu tiên |
|---|---|---|---|---|
| ADM-01 | `/admin` | Dashboard quản trị | Người dùng, workspace, tin đăng, hoạt động | P1 |
| ADM-02 | `/admin/users` | Quản lý người dùng | Tìm kiếm, xem, khóa/mở tài khoản theo quyền | P1 |
| ADM-03 | `/admin/workspaces` | Quản lý workspace | Danh sách, trạng thái ACTIVE/SUSPENDED | P1 |
| ADM-04 | `/admin/listings` | Quản lý tin đăng | Xem và xử lý tin vi phạm | P1 |
| ADM-05 | `/admin/audit-logs` | Nhật ký hoạt động | Bộ lọc sự kiện, người thực hiện, thời gian | P1 |
| ADM-06 | `/admin/reviews` | Kiểm duyệt đánh giá | Xử lý đánh giá bị báo cáo: ẩn/gỡ/khôi phục, có audit | PROPOSED |

> **Giới hạn quyền Admin (đã chốt):** màn hình Admin **không** có thao tác sửa giá thuê/đơn giá, chỉ số điện nước, hóa đơn, thanh toán, công nợ, hợp đồng, tiền cọc, chuyển phòng người thuê. Gỡ tin đăng (ADM-04) chỉ đổi trạng thái hiển thị công khai, không xóa phòng/hợp đồng. Việc Admin xem chi tiết hợp đồng/hóa đơn để xử lý khiếu nại **chưa được duyệt** — mặc định không truy cập.
>
> Landlord có thêm (PROPOSED): phản hồi đánh giá trong `/w/:workspaceId/reviews` (không sửa/xóa đánh giá).

### 3.6. System / Common

- `404 Not Found`, `403 Forbidden`, `500 Error`, `Offline/Network Error`.
- Trang/loading skeleton, empty state, error state, retry, toast, confirm dialog.
- Session expired UI, route guard, role-aware navigation, breadcrumb.
- Form unsaved-changes warning; upload ảnh preview, giới hạn định dạng/kích thước.

> Đặc tả nghiệp vụ chi tiết cho các mục PROPOSED: `docs/business/MARKETPLACE_SEARCH_SPEC.md`, `docs/business/BUSINESS_REQUIREMENTS.md`.

## 4. Các luồng người dùng bắt buộc có bản demo

1. Khách: Trang chủ → lọc phòng → chi tiết → đặt lịch xem → trạng thái chờ.
2. Chủ trọ: Đăng nhập → chọn/tạo workspace → thêm tòa nhà → thêm phòng → đăng tin.
3. Chủ trọ: Tạo người thuê → tạo hợp đồng cố định thời hạn → xem phòng đang thuê.
4. Chủ trọ: Thiết lập đơn giá → ghi điện nước → xem trước/tạo hóa đơn → xác nhận thanh toán một phần.
5. Người thuê: Liên kết hồ sơ → xem hóa đơn → gửi bằng chứng thanh toán → theo dõi trạng thái.
6. Admin: Đăng nhập → xem danh sách workspace/người dùng → quản lý trạng thái.

## 5. Quy tắc nghiệp vụ UI phải thể hiện đúng

- Hợp đồng **bắt buộc** `startDate`, `endDate`; ngày kết thúc được tính bao gồm. UI phải cảnh báo trùng lịch ACTIVE; backend mới là nơi quyết định cuối cùng.
- Mỗi hợp đồng có tối đa một hóa đơn thường/kỳ tháng; nếu đổi phòng giữa tháng, mỗi hợp đồng được lập riêng. Tiền phòng prorate theo ngày hợp đồng nằm trong tháng.
- Nước tính theo người: snapshot số người ở tại **ngày cuối kỳ**; hỗ trợ chế độ theo đồng hồ.
- Đơn giá theo phiên bản `effectiveFrom`; hóa đơn phát hành phải hiển thị snapshot, không tự cập nhật theo bảng giá mới.
- Thanh toán có thể một phần; chỉ khoản **đã được chủ trọ xác nhận** mới tính là đã thu.
- Tiền cọc được theo dõi riêng, không tự gộp doanh thu thuê.
- Không tự động liên kết Tenant với User chỉ vì trùng số điện thoại.
- Trạng thái vận hành phòng và trạng thái đăng tin phải độc lập.
- Trạng thái lịch xem: PENDING, CONFIRMED, COMPLETED, CANCELLED.
- Trạng thái bảo trì: OPEN, IN_PROGRESS, RESOLVED.
- Không hiện nút thao tác trái quyền, nhưng backend vẫn là nguồn kiểm tra quyền bắt buộc.

## 6. Design system & UX

- Phong cách: SaaS quản lý nhà trọ hiện đại, sáng sủa, dễ đọc; hỗ trợ tiếng Việt trước.
- Mobile-first, breakpoints nhất quán, bảng dữ liệu có responsive strategy (cards/scroll) trên màn nhỏ.
- Bộ token: màu nền, chữ, border, primary, semantic success/warning/error, spacing, radius, shadow, typography.
- Component dùng chung: `AppShell`, `Sidebar`, `Topbar`, `PageHeader`, `DataTable`, `FilterBar`, `SearchInput`, `Pagination`, `StatusBadge`, `FormField`, `DatePicker`, `CurrencyInput`, `ImageUploader`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `Skeleton`, `Toast`.
- Form: react-hook-form + zod là đề xuất; nếu thay thư viện cần thống nhất trước.
- Accessibility: label, keyboard navigation, focus state, contrast hợp lý.
- Định dạng tiền VND và ngày theo locale `vi-VN`; kỳ tính tiền theo `Asia/Ho_Chi_Minh`.
- Không hứa 60 FPS trên mọi thiết bị; tối ưu và đo các màn có bảng/map lớn.

## 7. Cấu trúc code đề xuất

```text
apps/web/
├── src/
│   ├── app/                 # providers, router, app bootstrap
│   ├── layouts/             # Public, User, Workspace, Tenant, Admin
│   ├── pages/               # route-level pages theo domain
│   ├── features/            # auth, rooms, buildings, tenants, billing...
│   ├── components/ui/       # reusable presentational components
│   ├── services/            # typed API client + adapters
│   ├── mocks/               # mock handlers/data (chỉ development)
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── public/
└── README.md
```

- Chia code theo feature/domain, lazy-load route-level modules khi phù hợp.
- TypeScript strict; tránh `any` không có lý do.
- Ưu tiên alias `@/`; không import xuyên qua internal implementation của feature khác.
- Có `.env.example` dùng `VITE_API_BASE_URL`, `VITE_USE_MOCK_API`; không commit `.env` thật.

## 8. API contract & mock strategy

- Backend prefix dự kiến `/api/v1`; không giả định API đã tồn tại.
- Mỗi feature có `types`, `api`, `hooks`, `components`, `pages` khi cần.
- Tách `HttpClient`/API adapter khỏi UI. TanStack Query quản lý loading/error/cache/invalidation.
- Mock bằng MSW hoặc adapter tương đương; có thể bật/tắt qua `VITE_USE_MOCK_API`.
- Mock phải mô phỏng cả thành công, validation 400, unauthorized 401, forbidden 403, not found 404, conflict 409, server error và empty states.
- API endpoints, DTO, enum, pagination/filter params chưa chốt phải ghi vào `docs/frontend/API_INTEGRATION_CONTRACT.md`; **không tự xem mock là hợp đồng chính thức**.
- Khi `packages/shared` có type/contract chính thức, ưu tiên tái sử dụng, tránh nhân bản type không tương thích.
- Refresh session cookie HttpOnly; frontend gọi API bằng cấu hình credentials phù hợp sau khi backend chốt CORS/cookie.

## 9. Kế hoạch bàn giao theo giai đoạn

| Giai đoạn | Kết quả bàn giao |
|---|---|
| FE-0 | Scaffold frontend, design tokens, layouts, router, mock infrastructure |
| FE-1 | Public marketplace + auth + account |
| FE-2 | Workspace dashboard, buildings, rooms, viewings |
| FE-3 | Tenants, contracts, vehicles |
| FE-4 | Rates, meters, invoices, payments, deposits |
| FE-5 | Tenant portal, maintenance, reports, admin |
| FE-6 | Responsive QA, accessibility, tests, integration handoff |

**Thứ tự ưu tiên:** Hoàn thiện FE-0/FE-1 trước, demo mock và review rồi mới mở rộng. Không cần chờ backend nhưng không làm giả kết nối API thật.

## 10. Tiêu chí nghiệm thu frontend

- [ ] Các route được liệt kê có page hoặc trạng thái placeholder rõ ràng; P0 có giao diện tương tác hoàn chỉnh.
- [ ] Luồng demo chính hoạt động với mock data, không chỉ là ảnh tĩnh.
- [ ] Có loading, empty, error, validation và permission states.
- [ ] Responsive ở mobile/tablet/desktop, không vỡ layout.
- [ ] TypeScript typecheck, lint, build thành công.
- [ ] Có Vitest cho component/logic quan trọng và Playwright smoke test cho luồng chính.
- [ ] Không hardcode token, secret, API URL production.
- [ ] Không phụ thuộc trực tiếp vào backend chưa hoàn thành.
- [ ] Tài liệu bàn giao đầy đủ, nêu rõ các API đang mock và các điểm cần chốt.

## 11. Các file Markdown frontend phải tự tạo/cập nhật

```text
docs/frontend/
├── README.md                      # Tổng quan và cách chạy
├── SCREEN_INVENTORY.md            # Checklist màn hình, route, trạng thái
├── DESIGN_SYSTEM.md               # Token, typography, UI conventions
├── USER_FLOWS.md                  # Các luồng và sơ đồ Mermaid
├── API_INTEGRATION_CONTRACT.md    # API/DTO/mock mapping, open questions
├── COMPONENT_CATALOG.md           # Component tái sử dụng
├── TEST_PLAN.md                   # Unit/E2E checklist
└── HANDOFF.md                     # Cách ghép apps/web, known issues
```

**Tất cả tài liệu viết bằng tiếng Việt**; tên kỹ thuật và code giữ tiếng Anh.

## 12. Prompt giao cho người phát triển frontend / Codex frontend

> Bạn là Senior Frontend Engineer phụ trách Rental Platform V1.0. Hãy đọc file `RENTAL_PLATFORM_FRONTEND_SPEC_V1.md` và trực tiếp triển khai frontend bằng React + Vite + TypeScript. Làm việc trên nhánh hoặc repo riêng, không sửa backend. Tự tạo toàn bộ các file `.md` trong `docs/frontend/`, source code, mocks, test và tài liệu bàn giao. Bắt đầu với FE-0 và FE-1; không triển khai ồ ạt tất cả màn hình trước khi có demo và review. Dùng mock service tách khỏi UI, chuẩn bị tích hợp `/api/v1` và `packages/shared` về sau. Chạy lint, typecheck, test, build và báo cáo kết quả bằng tiếng Việt. Không tuyên bố tích hợp API thật khi chưa có backend.

## 13. Điểm cần thống nhất trước khi tích hợp

1. Bộ API/DTO và enum chính thức từ backend; pagination, filters, error envelope.
2. Auth flow, cookie policy, CSRF/CORS, quyền và hành vi refresh.
3. Map provider, upload ảnh/object storage, form xác minh người dùng.
4. Quy tắc làm tròn tiền, proration, hóa đơn điều chỉnh, dữ liệu hợp đồng.
5. Quy trình Git: merge frontend vào `apps/web` qua PR, kiểm tra conflict, chạy CI toàn monorepo.

---

**Nguyên tắc cuối:** Frontend là ứng dụng thực có mock adapter, không phải bản thiết kế Figma hay tập hợp trang tĩnh. Mọi chức năng chưa có API thật phải được đánh dấu rõ để tích hợp sau.
