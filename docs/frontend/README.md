# Rental Platform V1.0 — Frontend

Ứng dụng React chạy độc lập bằng **mock adapter**, sẵn sàng ghép vào `apps/web` của monorepo. Không phụ thuộc backend đang phát triển.

## Công nghệ

React 18 · Vite 6 · TypeScript (strict) · React Router 6 (data router) · TanStack Query 5 · react-hook-form + zod · lucide-react · Vitest 3 + Testing Library · Playwright.

Không dùng thư viện UI/CSS bên ngoài: toàn bộ giao diện dựng từ design tokens (`src/styles/tokens.css`) và các component trong `src/components/ui`.

## Chạy dự án

```bash
cd apps/web
cp .env.example .env          # VITE_USE_MOCK_API=true (mặc định)
npm install
npm run dev                   # http://localhost:5173
```

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Dev server |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (unit + component) |
| `npm run test:e2e` | Playwright smoke trên cổng 5199. Cần `npx playwright install chromium`, hoặc dùng trình duyệt có sẵn: `PW_CHANNEL=msedge npm run test:e2e` |
| `npm run build` | Typecheck + build production |

## Tài khoản demo (mock)

Mật khẩu chung: `demo1234`. Trang đăng nhập có nút điền nhanh.

| Email | Vai trò | Dùng để demo |
|---|---|---|
| `quan@demo.vn` | OWNER workspace *Nhà Trọ An Nhiên Group*, MANAGER *SunHouse* | Luồng chủ trọ F2–F4 |
| `nam@demo.vn` | Người thuê đã liên kết (HĐ-1024, P.302) | Cổng người thuê F5 |
| `minh@demo.vn` | USER thường, có yêu cầu liên kết đang chờ | Lịch xem, thông báo, liên kết |
| `admin@demo.vn` | ADMIN | Quản trị F6 |

Liên kết hồ sơ thuê (mock): mã mời `ANNHIEN`, OTP `123456`, mã HĐ + SĐT phải khớp hồ sơ người đứng tên.

## Giả lập lỗi / trạng thái

Thêm `?mock=<scenario>` vào URL bất kỳ: `400 · 401 · 403 · 404 · 409 · 500 · network · empty · slow`.
Ví dụ: `/rooms?mock=500`, `/rooms?mock=empty`, `/w/ws-an-nhien/invoices?mock=slow`.

> Dữ liệu mock nằm trong bộ nhớ — tải lại trang sẽ reset. Dữ liệu được sinh tương đối theo **kỳ hiện tại** (`Asia/Ho_Chi_Minh`) nên luôn có "tháng này".

## Bản đồ tài liệu

| File | Nội dung |
|---|---|
| [PROJECT_CASE.md](PROJECT_CASE.md) | Case tổng quan: bài toán, actor, luồng, quy tắc, phân rã công việc |
| [SCREEN_INVENTORY.md](SCREEN_INVENTORY.md) | Checklist màn hình / route / trạng thái |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Token, typography, quy ước UI, biểu đồ |
| [USER_FLOWS.md](USER_FLOWS.md) | 6 luồng demo + sơ đồ Mermaid |
| [API_INTEGRATION_CONTRACT.md](API_INTEGRATION_CONTRACT.md) | Endpoint dự kiến, DTO, mock mapping, câu hỏi mở |
| [COMPONENT_CATALOG.md](COMPONENT_CATALOG.md) | Component tái sử dụng |
| [TEST_PLAN.md](TEST_PLAN.md) | Unit / E2E checklist |
| [HANDOFF.md](HANDOFF.md) | Cách ghép vào `apps/web`, known issues |
| [STATUS_REPORT.md](STATUS_REPORT.md) | Báo cáo tình trạng + bảng trang/API + ảnh, video demo trong `demo/` |
| [../business/](../business/BUSINESS_REQUIREMENTS.md) | Bổ sung nghiệp vụ: 4 không gian sản phẩm, phân quyền Admin, tìm theo khoảng cách/đánh giá, Trợ lý tìm trọ (PROPOSED) |
