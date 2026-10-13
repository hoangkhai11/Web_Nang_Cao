# Danh mục màn hình

Chú thích: ✅ hoàn chỉnh, chạy bằng mock · 🧩 UI hoàn chỉnh nhưng phụ thuộc API/dịch vụ chưa chốt (đã gắn nhãn **Mock** trên giao diện).
Tất cả trang có trạng thái loading (skeleton), empty, error + thử lại, và 403 khi thiếu quyền.

## Public / Marketplace — `PublicLayout`

| ID | Route | File | Trạng thái | Ghi chú |
|---|---|---|---|---|
| PUB-01 | `/` | `pages/public/HomePage.tsx` | ✅ | Theo ảnh demo 2: hero tìm kiếm, số liệu tin cậy, phòng nổi bật, cam kết, CTA chủ trọ |
| PUB-02 | `/rooms` | `pages/public/RoomsPage.tsx` | ✅ | Chip lọc nhanh, lọc khu vực/giá/diện tích/sức chứa/loại/tiện ích, sắp xếp, phân trang, bộ lọc lưu trên URL |
| PUB-03 | `/rooms/:roomId` | `pages/public/RoomDetailPage.tsx` | ✅ | Ảnh, giá, phí, tiện ích, vị trí, chủ trọ, CTA |
| PUB-04 | `/rooms/map` | `pages/public/RoomsMapPage.tsx` | 🧩 | Bản đồ **minh họa** – chưa chốt map provider |
| PUB-05 | `/rooms/:roomId/viewing` | `pages/public/ViewingBookingPage.tsx` | ✅ | Khung giờ, validation, kết quả PENDING |
| PUB-06 | `/about` | `pages/public/InfoPages.tsx` | ✅ | |
| PUB-07 | `/help` | `pages/public/InfoPages.tsx` | 🧩 | FAQ đủ; kênh liên hệ chưa vận hành |

## Auth / User — `PublicLayout` / `UserLayout`

| ID | Route | Trạng thái | Ghi chú |
|---|---|---|---|
| AUTH-01 | `/login` | ✅ | Email hoặc SĐT (chưa chốt), redirect an toàn, tài khoản demo |
| AUTH-02 | `/register` | ✅ | Validation zod, điều khoản, lỗi 409 theo field |
| AUTH-03 | `/forgot-password` | 🧩 | Phụ thuộc API reset |
| USR-01 | `/account` | ✅ | Cảnh báo rời trang khi chưa lưu |
| USR-02 | `/my-viewings` | ✅ | Tab theo trạng thái, hủy khi PENDING/CONFIRMED |
| USR-03 | `/notifications` | 🧩 | Trong app ✅; email/SMS/Zalo chưa có |
| USR-04 | `/workspaces/select` | ✅ | Tạo workspace mới chờ API |

## Workspace — `WorkspaceLayout` (`/w/:workspaceId/...`)

| ID | Route | File | Trạng thái |
|---|---|---|---|
| WSP-01 | `dashboard` | `DashboardPage.tsx` | ✅ theo ảnh demo 1, số liệu tính từ mock DB |
| WSP-02 | `settings` | `WorkspaceAdminPages.tsx` | ✅ (chỉ OWNER) |
| WSP-03 | `members` | `WorkspaceAdminPages.tsx` | ✅ thêm, đổi role, khóa, xóa; gửi email mời 🧩 |
| BLD-01..04 | `buildings`, `buildings/new`, `buildings/:id`, `buildings/:id/edit` | `PropertyPages.tsx` | ✅ |
| ROOM-01..04 | `rooms`, `rooms/new`, `rooms/:id`, `rooms/:id/edit` | `PropertyPages.tsx` | ✅ vận hành ⟂ đăng tin; upload ảnh chỉ preview 🧩 |
| VIEW-01 | `viewings` | `PropertyPages.tsx` | ✅ xác nhận/hoàn thành/hủy |
| TEN-01..03 | `tenants`, `tenants/new`, `tenants/:id` (+ `/edit`) | `LeasingPages.tsx` | ✅ duyệt/từ chối liên kết |
| CTR-01..04 | `contracts`, `contracts/new`, `contracts/:id`, `contracts/:id/edit` | `LeasingPages.tsx` | ✅ cảnh báo trùng ACTIVE, kích hoạt, chấm dứt |
| VEH-01 | `vehicles` | `LeasingPages.tsx` | ✅ |
| RATE-01 | `rates` | `BillingPages.tsx` | ✅ phiên bản effectiveFrom |
| METER-01 | `meters` | `BillingPages.tsx` | ✅ gợi ý số cũ, khóa kỳ đã phát hành |
| INV-01..02 | `invoices`, `invoices/:id` | `BillingPages.tsx` | ✅ snapshot + điều chỉnh có audit |
| INV-03 | `billing/run` | `BillingPages.tsx` | ✅ chọn kỳ → xem trước → phát hành → kết quả |
| PAY-01 | `payments` | `BillingPages.tsx` | ✅ xác nhận/từ chối, thu một phần |
| DEP-01 | `deposits` | `BillingPages.tsx` | ✅ thu/hoàn/khấu trừ tách doanh thu |
| MNT-01..02 | `maintenance`, `maintenance/:id` | `OperationsPages.tsx` | ✅ |
| RPT-01 | `reports` | `OperationsPages.tsx` | ✅ xuất file 🧩 |

## Tenant Portal — `TenantLayout`

| ID | Route | Trạng thái |
|---|---|---|
| TPT-01 | `/tenant` | ✅ |
| TPT-02 | `/tenant/contracts` | ✅ |
| TPT-03 | `/tenant/invoices` | ✅ |
| TPT-04 | `/tenant/invoices/:invoiceId` | ✅ cổng thanh toán online 🧩 |
| TPT-05 | `/tenant/payments/new` | ✅ trạng thái chờ chủ trọ xác nhận |
| TPT-06 | `/tenant/maintenance` | ✅ |
| TPT-07 | `/tenant/link-account` | 🧩 OTP giả lập |

Trang TPT-01..06 chỉ mở khi tài khoản đã liên kết (guard `RequireLinkedTenant`), nếu chưa sẽ chuyển tới TPT-07.

## Admin — `AdminLayout` (chỉ ADMIN)

| ID | Route | Trạng thái |
|---|---|---|
| ADM-01 | `/admin` | ✅ |
| ADM-02 | `/admin/users` | ✅ |
| ADM-03 | `/admin/workspaces` | ✅ ACTIVE/SUSPENDED |
| ADM-04 | `/admin/listings` | ✅ tin bị gỡ ẩn khỏi marketplace |
| ADM-05 | `/admin/audit-logs` | ✅ lọc nhóm/thời gian/từ khóa |

## System / Common

| Hạng mục | Vị trí |
|---|---|
| 404 / 403 / 500 / Offline | `pages/system/ErrorPages.tsx` (`/403`, `/500`, `/offline`, route `*`) |
| Error boundary của router | `RouteErrorBoundary` |
| Banner mất mạng, hộp thoại hết phiên (401), banner chế độ mock | `layouts/parts/GlobalBanners.tsx` |
| Route guard | `app/guards.tsx` |
| Điều hướng theo vai trò | `AreaSwitcher`, menu sidebar ẩn mục trái quyền |
| Breadcrumb | `PageHeader` |
| Cảnh báo rời trang khi chưa lưu | `hooks/useUnsavedChangesWarning.ts` (mọi form tạo/sửa) |
| Upload ảnh có preview, giới hạn định dạng/dung lượng | `components/ui/ImageUploader.tsx` |

## Màn hình đề xuất — CHƯA TRIỂN KHAI (PROPOSED, chờ Product Owner)

Nguồn: [docs/business/MARKETPLACE_SEARCH_SPEC.md](../business/MARKETPLACE_SEARCH_SPEC.md). Chưa có code cho các mục dưới đây.

| ID | Route | Nội dung |
|---|---|---|
| PUB-02+ | `/rooms` | Lọc/sắp xếp theo khoảng cách (bán kính hoặc thời gian di chuyển) và theo đánh giá |
| PUB-03+ | `/rooms/:roomId` | Khoảng cách tới địa điểm, khối đánh giá, chi phí ước tính |
| PUB-08 | `/rooms/smart-search` | Trợ lý tìm trọ thông minh (P04-B) |
| TPT-08 | `/tenant/reviews` | Người thuê viết đánh giá |
| WSP-R | `/w/:workspaceId/reviews` | Chủ trọ phản hồi đánh giá (không sửa/xóa) |
| ADM-06 | `/admin/reviews` | Admin kiểm duyệt đánh giá |

> Lưu ý đối chiếu BRD: frontend demo đang dùng trạng thái hợp đồng `TERMINATED` và các trạng thái hóa đơn `PARTIALLY_PAID/PAID/OVERDUE` (trạng thái thanh toán suy ra). Khi tích hợp phải theo state machine của BRD — xem mâu thuẫn M-05..M-07 trong [BUSINESS_REQUIREMENTS.md](../business/BUSINESS_REQUIREMENTS.md#9-mâu-thuẫn-tài-liệu-đã-phát-hiện).
