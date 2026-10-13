# Test Plan

## Unit / component — Vitest (`npm run test`)

| File | Bao phủ |
|---|---|
| `src/features/billing/calc.test.ts` | Trùng hợp đồng ACTIVE (tính bao gồm ngày cuối), số ngày trong kỳ, prorate, chọn đơn giá theo `effectiveFrom`, snapshot người ở ngày cuối kỳ, dựng dòng hóa đơn (điện, nước theo người/đồng hồ, internet, rác, xe), số dư & trạng thái chỉ tính khoản đã xác nhận |
| `src/lib/lib.test.ts` | Cộng tháng/ngày, năm nhuận, ngày theo `Asia/Ho_Chi_Minh`, định dạng VND/%, `parseVnd`, phân trang rút gọn |
| `src/features/features.test.ts` | Lọc/sắp xếp phòng mock, schema đăng ký/hợp đồng/người thuê/lịch xem, quy tắc hủy lịch, permission matrix |
| `src/components/ui/ui.test.tsx` | `FormField` a11y, `StatusBadge` có chữ, `ErrorState` 403 vs 500, `DataTable` rỗng, `CurrencyInput` |

## E2E smoke — Playwright (`npm run test:e2e`)

Chạy trên 2 profile: Desktop và Pixel 7 (mobile). File `e2e/smoke.spec.ts`. Kết quả lần chạy 14/10/2026 với Edge (`PW_CHANNEL=msedge`): **14/14 passed**.

- [x] F1 — Khách: trang chủ → lọc → chi tiết → đặt lịch → trạng thái chờ xác nhận
- [x] Route guard — chưa đăng nhập vào workspace bị chuyển tới `/login?redirect=`
- [x] F2/F4 — Chủ trọ: mở **toàn bộ 30 route** workspace, không lỗi runtime
- [x] F4 — Xem trước (có cảnh báo thiếu chỉ số) → phát hành → ghi nhận thanh toán một phần
- [x] F5 — Người thuê: các trang cổng, chi tiết hóa đơn
- [x] F6 — Admin: các trang quản trị, tạm khóa workspace
- [x] Người dùng thường + trạng thái lỗi mock (`?mock=500`, `?mock=empty`), 403 khi vào workspace không phải thành viên, 404

## Kiểm thử thủ công còn lại

- [ ] Responsive: 375 / 768 / 1280px cho Dashboard, Rooms, Billing run, Meters (bảng nhập liệu)
- [ ] Bàn phím: tab qua sidebar, dialog (Esc), chọn khung giờ, tooltip biểu đồ (focus)
- [ ] Trình đọc màn hình: thông báo toast (`aria-live`), lỗi form (`role=alert`)
- [ ] Cảnh báo rời trang với form chưa lưu (điều hướng trong app + đóng tab)
- [ ] `?mock=slow` để kiểm tra skeleton; `?mock=401` để kiểm tra hộp thoại hết phiên
- [ ] Đo hiệu năng bảng lớn khi có dữ liệu thật (spec: không cam kết 60 FPS mọi thiết bị)
