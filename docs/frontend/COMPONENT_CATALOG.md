# Component Catalog

Import chung: `import { … } from '@/components/ui'`.

## Layout

| Component | File | Mô tả |
|---|---|---|
| `AppShell` | `layouts/AppShell.tsx` | Sidebar + Topbar + nội dung; sidebar thành off-canvas dưới 1024px |
| `PublicLayout` / `SiteHeader` / `SiteFooter` | `layouts/PublicLayout.tsx` | Header dính, menu mobile, footer 4 cột |
| `UserLayout` | `layouts/UserLayout.tsx` | Header public + menu tài khoản |
| `WorkspaceLayout` | `layouts/WorkspaceLayout.tsx` | Kiểm tra membership, menu theo quyền, thẻ gói dịch vụ; truyền `membership` qua Outlet context |
| `TenantLayout`, `AdminLayout` | `layouts/*.tsx` | Dùng `AppShell` |
| `AreaSwitcher` | `layouts/parts/AreaSwitcher.tsx` | Tab chuyển khu vực, ẩn theo vai trò |
| `UserMenu` | `layouts/parts/UserMenu.tsx` | Avatar, thông báo, menu, đăng xuất |
| `GlobalBanners` | `layouts/parts/GlobalBanners.tsx` | Banner mock, offline, hộp thoại hết phiên |

## UI cơ bản

| Component | Props chính | Ghi chú |
|---|---|---|
| `Button`, `ButtonLink` | `variant`, `size`, `block`, `loading` | `ButtonLink` là `Link` của router có style nút |
| `Badge`, `StatusBadge`, `MockBadge` | `tone`; `status` + `map` | `StatusBadge` luôn kèm chữ |
| `FormField` | `label`, `required`, `error`, `hint` | Tự gắn id/aria cho control con |
| `SearchInput` | `value`, `onChange`, `delay` | Debounce 300ms |
| `FilterBar` | `children`, `actions` | Hàng lọc trên bảng |
| `CurrencyInput` | `value: number`, `onChange` | Hiển thị `3.500.000 ₫` |
| `DatePicker` | như `<input>` | `type=date` gốc, giá trị `yyyy-MM-dd` |
| `Select` | như `<select>` | |
| `ImageUploader` | `value: string[]`, `onChange`, `max` | Kiểm tra JPG/PNG/WEBP ≤ 5MB, chỉ preview (chưa upload) |
| `DataTable<T>` | `columns`, `rows`, `rowKey`, `isLoading`, `error`, `onRetry`, `empty`, `onRowClick` | Tự có loading/error/empty, dạng thẻ trên mobile |
| `Pagination` | `page`, `pageSize`, `total`, `onChange` | Rút gọn bằng "…" |
| `PageHeader` | `title`, `description`, `actions`, `breadcrumb`, `eyebrow` | |
| `Section` | `title`, `subtitle`, `actions`, `flush` | Card có header |
| `StatCard` | `label`, `value`, `unit`, `icon`, `footer`, `tone` | Thẻ KPI |
| `KeyValueList` | `items` | Danh sách nhãn – giá trị |
| `Tabs` | `tabs`, `value`, `onChange` | ARIA tablist |
| `ProgressBar` | `value (0..1)`, `label` | |
| `Modal` | `open`, `title`, `onClose` | Esc / click nền để đóng, focus vào input đầu tiên |
| `ConfirmDialog` | `open`, `title`, `danger`, `loading`, `onConfirm`, `onCancel` | `role=alertdialog` |
| `ToastProvider` / `useToast()` | `success`, `error`, `show` | Tự đóng sau 4,5s |
| `EmptyState`, `ErrorState`, `Skeleton`, `LoadingBlock` | | `ErrorState` chọn thông điệp theo 401/403/404/network |

## Domain

| Component | File |
|---|---|
| `RoomCard` (`row` / `column`) | `features/rooms/components/RoomCard.tsx` |
| `RoomImage` (fallback khi lỗi ảnh) | `features/rooms/components/RoomImage.tsx` |
| `MapPreview` (bản đồ minh họa) | `features/rooms/components/MapPreview.tsx` |
| `BarChart` (cột nhóm, tooltip, xem bảng) | `components/charts/BarChart.tsx` |
| `DonutChart` (cơ cấu) | `components/charts/DonutChart.tsx` |
| `InvoiceLinesTable` (snapshot + điều chỉnh + tổng) | `pages/workspace/BillingPages.tsx` (dùng lại ở cổng người thuê) |

## Hooks tiện ích

| Hook | Mục đích |
|---|---|
| `useSearchState(keys)` | Đồng bộ bộ lọc với query string |
| `useWorkspaceContext()` | `ws`, `base`, `membership`, `can(permission)` |
| `useUnsavedChangesWarning(dirty)` | Chặn rời trang khi form chưa lưu |
| `useOnlineStatus()` | Phát hiện offline |
