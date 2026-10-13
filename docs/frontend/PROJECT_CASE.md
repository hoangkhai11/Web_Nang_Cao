# Rental Platform V1.0 — Case công việc Frontend

> Tóm tắt có cấu trúc từ `RENTAL_PLATFORM_FRONTEND_SPEC_V1.md` + 2 ảnh UI demo (Dashboard chủ trọ, Trang tìm phòng).
> Mục đích: nắm nhanh *làm gì – cho ai – theo thứ tự nào – thế nào là xong*.
> Cập nhật: 14/10/2026.

---

## 1. Bài toán trong một đoạn

Xây **frontend React thật** (không phải ảnh/trang tĩnh) cho nền tảng thuê trọ gồm 2 mảng:

1. **Marketplace công khai** — khách tìm phòng, xem chi tiết, đặt lịch xem.
2. **SaaS quản lý nhà trọ** — chủ trọ quản lý tòa nhà, phòng, người thuê, hợp đồng, điện nước, hóa đơn, thanh toán; người thuê xem hóa đơn và gửi minh chứng; admin quản trị nền tảng.

Backend (NestJS `/api/v1`) **đang làm song song bởi nhóm khác** → frontend chạy bằng **mock adapter** tách khỏi UI, khi tích hợp chỉ thay adapter, không viết lại UI.

## 2. Ràng buộc bắt buộc

| # | Ràng buộc | Hệ quả khi code |
|---|---|---|
| R1 | Stack cố định: React + Vite + TypeScript strict, React Router, TanStack Query | Không đổi stack, không thêm microservice |
| R2 | Không sửa backend, không làm chung nhánh với backend | Làm ở `apps/web` trên nhánh `feat/frontend-v1` |
| R3 | Không hardcode mock data trong page/component | Data nằm ở `src/mocks/`, page gọi qua `features/*/api.ts` |
| R4 | Bật/tắt mock bằng `VITE_USE_MOCK_API` | Mỗi feature có 2 implementation: mock / http |
| R5 | Không secret, không lưu refresh token ở localStorage | Session = cookie HttpOnly (`credentials: include`) |
| R6 | Không “giả vờ” tính năng thật | Thanh toán, thông báo, bản đồ… gắn nhãn **Mock** rõ ràng |
| R7 | Mock phải mô phỏng 400/401/403/404/409/500/network/empty | `?mock=<scenario>` trên URL |
| R8 | Tiếng Việt trước; VND & ngày theo `vi-VN`, kỳ tính tiền `Asia/Ho_Chi_Minh` | Dùng `src/lib/format.ts` |
| R9 | Mobile-first, bảng chuyển thành card/scroll trên màn nhỏ | Mọi trang phải test ở ~375px |

## 3. Tác nhân (actors) và layout

| Actor | Làm được gì | Layout |
|---|---|---|
| Khách | Tìm/xem phòng, đặt lịch xem, đăng ký/đăng nhập | `PublicLayout` |
| USER | Hồ sơ, lịch xem của tôi, thông báo, chọn workspace | `UserLayout` |
| OWNER / MANAGER / STAFF | Quản lý workspace theo **membership** (không có role toàn cục “LANDLORD”) | `WorkspaceLayout` |
| Tenant đã liên kết | Hợp đồng, hóa đơn, gửi minh chứng thanh toán, bảo trì của mình | `TenantLayout` |
| ADMIN | Người dùng, workspace, tin đăng, audit log | `AdminLayout` |

## 4. Case minh họa xuyên suốt (dữ liệu mock dùng thống nhất)

**Workspace:** *Nhà Trọ An Nhiên Group* — 3 tòa: A (Lê Văn Việt), B (Đỗ Xuân Hợp), C (Tăng Nhơn Phú) — 28 phòng, 25 đang thuê (89,3%), 3 trống.
**Kỳ T10/2024:** dự kiến thu 98.500.000 ₫, thực thu đã xác nhận 78.200.000 ₫, công nợ 20.300.000 ₫ (5 phòng chưa nộp).

| Nhân vật | Vai trò | Đi qua luồng |
|---|---|---|
| **Minh** (khách) | Sinh viên tìm phòng Bình Thạnh 3–5 triệu | F1 |
| **Nguyễn Văn Quân** | OWNER của An Nhiên Group | F2, F3, F4 |
| **Trần Văn Nam** | Người thuê P.302 Tòa A, hợp đồng HĐ-1024 | F5 |
| **Admin hệ thống** | ADMIN | F6 |

### F1 — Khách tìm và đặt lịch xem phòng
Trang chủ → nhập khu vực *Bình Thạnh*, giá *3–5 triệu* → `/rooms` lọc + sắp xếp, xem bản đồ minh họa → mở *Tòa nhà SunHouse – Phòng Studio* (3.800.000 ₫) → `/rooms/:id/viewing` chọn khung giờ, nhập SĐT → yêu cầu tạo với trạng thái **PENDING** → xem lại tại `/my-viewings`.

### F2 — Chủ trọ dựng workspace
Đăng nhập → `/workspaces/select` → vào An Nhiên Group → thêm tòa nhà → thêm phòng P.304 → bật **trạng thái đăng tin** (độc lập với trạng thái vận hành).

### F3 — Chủ trọ cho thuê
Tạo hồ sơ người thuê *Trần Văn Nam* (**không** tự liên kết tài khoản theo SĐT) → tạo hợp đồng có `startDate`/`endDate` (ngày kết thúc tính bao gồm; cảnh báo nếu trùng hợp đồng ACTIVE) → phòng chuyển *Đang thuê*.

### F4 — Chủ trọ thu tiền tháng
Thiết lập đơn giá (phiên bản theo `effectiveFrom`) → ghi chỉ số điện nước kỳ T10 → *Lập HĐ tháng 10*: xem trước từng hợp đồng → phát hành (hóa đơn giữ **snapshot** đơn giá) → Nam trả 2.000.000/4.850.000 → chủ trọ xác nhận **thanh toán một phần**; chỉ khoản đã xác nhận mới tính “thực thu”.

### F5 — Người thuê
Nam đăng nhập → `/tenant/link-account` gửi yêu cầu liên kết có xác minh → xem hóa đơn T10 → gửi minh chứng chuyển khoản → trạng thái *Chờ chủ trọ xác nhận*.

### F6 — Admin
Đăng nhập → `/admin/workspaces` → chuyển 1 workspace ACTIVE → SUSPENDED → kiểm tra audit log.

## 5. Quy tắc nghiệp vụ phải thể hiện đúng trên UI

| Mã | Quy tắc | Nơi thể hiện |
|---|---|---|
| BR-01 | Hợp đồng bắt buộc `startDate`, `endDate`; endDate tính bao gồm; cảnh báo trùng ACTIVE (backend quyết định cuối) | CTR-02, CTR-04 |
| BR-02 | Tối đa 1 hóa đơn thường / hợp đồng / kỳ; đổi phòng giữa tháng → mỗi hợp đồng 1 hóa đơn; tiền phòng prorate theo ngày | INV-03 |
| BR-03 | Nước theo người: snapshot số người ở **ngày cuối kỳ**; hỗ trợ chế độ đồng hồ | RATE-01, INV-03 |
| BR-04 | Đơn giá có phiên bản `effectiveFrom`; hóa đơn đã phát hành không đổi theo bảng giá mới | RATE-01, INV-02 |
| BR-05 | Thanh toán một phần; chỉ khoản đã xác nhận mới là “đã thu” | PAY-01, WSP-01, TPT-05 |
| BR-06 | Tiền cọc theo dõi riêng, không gộp doanh thu | DEP-01, RPT-01 |
| BR-07 | Không tự liên kết Tenant ↔ User vì trùng SĐT | TEN-02, TPT-07 |
| BR-08 | Trạng thái vận hành phòng ⟂ trạng thái đăng tin | ROOM-01..04 |
| BR-09 | Lịch xem: PENDING / CONFIRMED / COMPLETED / CANCELLED | USR-02, VIEW-01 |
| BR-10 | Bảo trì: OPEN / IN_PROGRESS / RESOLVED | MNT-01, TPT-06 |
| BR-11 | Ẩn nút trái quyền; backend vẫn là nơi kiểm quyền | Toàn bộ WorkspaceLayout |

## 6. Phân rã công việc theo giai đoạn

Chú thích: ✅ xong (chạy bằng mock) · 🧩 UI xong, phụ thuộc API/dịch vụ chưa chốt (gắn nhãn Mock)

> Cập nhật 14/10/2026: theo yêu cầu “dựng hoàn chỉnh Front-end, không đụng Back-end”, phạm vi mở rộng từ FE-0/FE-1 sang **toàn bộ FE-0 → FE-6**.

| Giai đoạn | Nội dung | Màn hình | Trạng thái |
|---|---|---|---|
| FE-0 | Scaffold, tokens, layouts, router, guard, mock infra, UI kit | — | ✅ |
| FE-1 | Public + Auth + Account | PUB-01..07, AUTH-01..03, USR-01..04 | ✅ (PUB-04, AUTH-03, USR-03 🧩) |
| FE-2 | Dashboard, buildings, rooms, viewings, settings, members | WSP-01..03, BLD-01..04, ROOM-01..04, VIEW-01 | ✅ |
| FE-3 | Tenants, contracts, vehicles | TEN-01..03, CTR-01..04, VEH-01 | ✅ |
| FE-4 | Rates, meters, invoices, billing run, payments, deposits | RATE-01, METER-01, INV-01..03, PAY-01, DEP-01 | ✅ |
| FE-5 | Tenant portal, maintenance, reports, admin | TPT-01..07, MNT-01..02, RPT-01, ADM-01..05 | ✅ (TPT-07 OTP 🧩) |
| FE-6 | Test, tài liệu bàn giao | Vitest, Playwright smoke, docs/frontend/*.md | ✅ (QA responsive/a11y thủ công: xem TEST_PLAN) |

Chi tiết từng route: [SCREEN_INVENTORY.md](SCREEN_INVENTORY.md). Cách chạy: [README.md](README.md).

## 7. Map ảnh UI demo → component

| Vùng trên ảnh | Component / nguồn dữ liệu |
|---|---|
| Ảnh 1 – sidebar nghiệp vụ | `WorkspaceLayout` → `Sidebar` (nhóm *Nghiệp vụ vận hành*, *Cấu hình & quản trị*) |
| Ảnh 1 – tab Tìm phòng / Chủ trọ / Người thuê / Quản trị | `Topbar` chuyển “khu vực” (demo role switcher) |
| Ảnh 1 – 6 thẻ KPI | `StatCard` ← `dashboard.api.getSummary()` |
| Ảnh 1 – Hiệu quả thu tiền 6 tháng | `RevenueChart` (SVG, có tooltip, chú giải, bảng dữ liệu) |
| Ảnh 1 – Cơ cấu dịch vụ | `ServiceDonut` + chú giải có số tiền |
| Ảnh 1 – Hóa đơn cần thu & quá hạn | `DataTable` → card trên mobile, `StatusBadge` |
| Ảnh 1 – Lịch xem phòng / Yêu cầu sửa chữa | `ViewingList`, `MaintenanceList` |
| Ảnh 1 – Hiện trạng 3 tòa nhà | `OccupancyGrid` |
| Ảnh 2 – Hero tìm kiếm | `SearchHero` (khu vực, khoảng giá, loại phòng) |
| Ảnh 2 – Chip lọc + dropdown + sắp xếp | `FilterBar` (đồng bộ query string) |
| Ảnh 2 – Thẻ phòng | `RoomCard` (Đã xác thực, còn N phòng, tiện ích, Xem chi tiết / Đặt lịch xem) |
| Ảnh 2 – Bản đồ khu vực | `MapPreview` — **minh họa**, chưa chọn map provider |

## 8. Định nghĩa “xong” (Definition of Done)

- Route có trang thật (P0) hoặc placeholder rõ ràng.
- Mỗi trang có đủ trạng thái: loading (skeleton), empty, error + retry, validation, permission (403).
- Chạy được bằng mock, không phụ thuộc backend.
- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` đều pass.
- Có Vitest cho logic quan trọng + Playwright smoke cho F1.
- Tài liệu `docs/frontend/*.md` cập nhật (tiếng Việt).

## 9. Điểm còn mở (cần chốt với backend / PO)

1. API/DTO/enum chính thức, phân trang, filter, error envelope.
2. Auth flow: đăng nhập bằng email hay SĐT, cookie/CSRF/CORS, refresh.
3. Map provider, upload ảnh, quy trình xác minh liên kết tenant.
4. Quy tắc làm tròn tiền, proration, hóa đơn điều chỉnh.
5. Quy trình merge vào `apps/web` qua PR + CI monorepo.
