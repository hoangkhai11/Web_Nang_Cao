# Design System

Phong cách SaaS quản lý nhà trọ sáng sủa, theo hai ảnh UI demo. Nguồn token duy nhất: `apps/web/src/styles/tokens.css`.

## Token

| Nhóm | Token chính |
|---|---|
| Nền | `--color-bg #f4f6fb`, `--color-surface #fff`, `--color-surface-muted`, `--color-surface-inverse #0b1220` |
| Chữ | `--color-text #0f172a`, `--color-text-secondary`, `--color-text-muted` |
| Viền | `--color-border`, `--color-border-strong` |
| Thương hiệu | `--color-primary #1d4ed8` (+ `-hover`, `-soft`, `-softer`), `--color-accent-dark` (nút đen) |
| Ngữ nghĩa | `--color-success`, `--color-warning`, `--color-danger`, `--color-info` (+ `-soft`) |
| Biểu đồ | `--chart-1..4` (bảng màu phân loại đã kiểm định), `--chart-reference` (xám trung tính), `--chart-grid` |
| Khoảng cách | thang 4px: `--space-1` (4) … `--space-16` (64) |
| Bo góc | `--radius-sm 6`, `md 10`, `lg 14`, `xl 20`, `full` |
| Đổ bóng | `--shadow-sm/md/lg`, `--focus-ring` |
| Chữ | `Be Vietnam Pro` (hỗ trợ tiếng Việt), cỡ `--text-xs` 12px … `--text-4xl` 36px |

Breakpoint: `sm 640 · md 768 · lg 1024 · xl 1280`. Thiết kế **mobile-first**.

## Quy ước UI

- **Nút:** `primary` (xanh, hành động chính trong form), `dark` (CTA chính như ảnh demo: "Đặt lịch xem", "Thêm phòng mới"), `secondary` (viền), `soft`, `ghost`, `danger`.
- **Trạng thái:** luôn dùng `StatusBadge` kèm chữ, không chỉ dựa vào màu. Mỗi domain có bảng ánh xạ trong `features/*/labels.ts`.
- **Bảng dữ liệu:** `DataTable` tự chuyển thành dạng thẻ dưới 768px (mỗi ô hiện nhãn cột).
- **Form:** `FormField` tự gắn `id`, `aria-invalid`, `aria-describedby`, hiển thị lỗi bằng `role="alert"`; dấu `*` cho trường bắt buộc.
- **Tiền / ngày:** chỉ dùng `lib/format.ts` (`vi-VN`, VND, múi giờ `Asia/Ho_Chi_Minh`); kỳ tính tiền bằng `lib/dates.ts`.
- **Mock:** chức năng chưa có thật hiển thị `MockBadge` (viền đứt, màu tím), kèm banner chế độ demo ở đầu trang.
- **Accessibility:** có skip-link, focus ring rõ, label cho mọi input, dialog có `aria-modal` và đóng bằng Esc, tôn trọng `prefers-reduced-motion`.

## Biểu đồ

- Biểu đồ cột nhóm (`BarChart`) dùng một trục Y, góc trên bo 4px, khe 2px giữa các cột; tooltip khi hover hoặc focus bàn phím; có nút **Xem bảng** (phương án thay thế dễ truy cập).
- "Dự kiến thu" dùng màu xám trung tính `--chart-reference` làm mốc; "Đã thu" dùng `--chart-1`.
- Biểu đồ tròn (`DonutChart`) dùng 4 màu phân loại theo thứ tự cố định, chú giải luôn kèm số tiền và %.
- Ảnh demo dùng nhiều sắc xanh dương cho biểu đồ tròn, nhưng các cặp màu đó không đạt kiểm tra độ tách màu cho người mù màu. Vì vậy đã thay bằng bảng màu phân loại đã kiểm định.

## Đối chiếu ảnh demo

| Ảnh | Thành phần | Hiện thực |
|---|---|---|
| 1 | Sidebar nhóm "Nghiệp vụ vận hành / Cấu hình & quản trị", thẻ gói dịch vụ | `WorkspaceLayout` + `AppShell` |
| 1 | Tab Tìm phòng / Chủ trọ / Người thuê / Quản trị | `AreaSwitcher` (ẩn tab trái quyền) |
| 1 | 6 thẻ KPI, biểu đồ 6 tháng, cơ cấu dịch vụ, hóa đơn cần thu, lịch xem, sửa chữa, sơ đồ phòng | `DashboardPage` |
| 2 | Hero tìm kiếm 3 ô + "Tìm ngay", hàng số liệu tin cậy | `SearchHero`, `TrustStats` |
| 2 | Chip gợi ý nhanh, dropdown lọc, sắp xếp dạng tab | `RoomsPage` |
| 2 | Thẻ phòng ngang (badge xác thực, còn N phòng, tiện ích, 2 nút) | `RoomCard layout="row"` |
| 2 | Bản đồ khu vực với ghim giá | `MapPreview` (minh họa) |
| 2 | 3 cam kết an toàn, dải CTA tối cho chủ trọ, footer 4 cột | `HomePage`, `SiteFooter` |
