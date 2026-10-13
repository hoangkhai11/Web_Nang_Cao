# Handoff — ghép frontend vào monorepo

## Vị trí & nhánh

- Mã nguồn: `apps/web/` (đúng cấu trúc thư mục ở mục 7 của spec). Tài liệu: `docs/frontend/`.
- Spec yêu cầu làm trên nhánh `feat/frontend-v1`. Repo này hiện **chưa tạo nhánh hay commit** cho phần frontend, việc này do người phụ trách thực hiện.
- Khi ghép vào monorepo: mở PR từ `feat/frontend-v1` vào `apps/web`, chạy CI cho toàn monorepo, xử lý conflict ở các file `package.json`, lockfile, cấu hình ESLint/TS ở root.

## Checklist tích hợp backend

1. Đặt `VITE_API_BASE_URL` trỏ tới backend, `VITE_USE_MOCK_API=false`.
2. Với từng `features/*/api.ts`: đối chiếu endpoint/DTO với backend, sửa **chỉ** object `*Http` (có thể thêm hàm map DTO → type UI).
3. Khi `packages/shared` có type chính thức, thay type trong `features/*/types.ts` (giữ tên export để UI không phải sửa).
4. Chốt CORS + cookie (`credentials: 'include'`), CSRF header nếu có. Chỉnh trong `services/http/httpClient.ts`.
5. Xác nhận chuẩn lỗi (`statusCode`, `message`, `fieldErrors`) để form tự hiển thị lỗi theo field.
6. Gỡ hoặc ẩn khối "Tài khoản demo" ở trang đăng nhập (hiện chỉ hiện khi `useMockApi`).
7. Thay `MapPreview` bằng map provider đã chốt; thay `ImageUploader` bằng luồng upload thật.
8. Bundle hiện đang chứa luôn module mock. Khi cần tách hẳn, chuyển `env.useMockApi ? mock : http` sang dynamic import, hoặc alias theo `mode`.

## Known issues / giới hạn

- Dữ liệu mock nằm trong bộ nhớ, tải lại trang sẽ reset. Phiên mock lưu **userId** trong `sessionStorage` (không phải token).
- Các chức năng **chưa hoạt động thật** (đã gắn nhãn Mock trên UI): thanh toán online, gửi email/SMS/Zalo, OTP, upload ảnh, bản đồ, xuất báo cáo, tạo workspace mới, quên mật khẩu.
- Sau khi chủ trọ duyệt liên kết, tài khoản người thuê cần đăng nhập lại để thấy Cổng người thuê (cache `auth/me` 5 phút).
- Logic tiền (prorate, làm tròn, nước theo người) ở `features/billing/calc.ts` chỉ dùng cho xem trước/mock. Backend phải là nguồn tính chính thức (xem câu hỏi mở 6–8).
- ESLint còn một số cảnh báo `react-refresh/only-export-components` (chỉ ảnh hưởng hot reload, không ảnh hưởng chạy).
- Font Be Vietnam Pro tải từ Google Fonts. Ảnh phòng mock lấy từ Unsplash CDN, có ảnh dự phòng khi lỗi tải.
- `npm install` có thể cảnh báo `allow-scripts` cho `esbuild`. Build vẫn chạy bình thường.
