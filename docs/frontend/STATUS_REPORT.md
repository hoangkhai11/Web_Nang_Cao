# Báo cáo tình trạng Frontend — Rental Platform V1.0

> Ngày: 14/10/2026 · Phạm vi: `apps/web` (React + Vite + TS) · Chạy hoàn toàn bằng **mock adapter**, chưa nối backend.
> Ảnh/video demo: [`docs/frontend/demo/`](demo/) (desktop 1440px + mobile 390px).

## 1. Màn hình

**Đã làm 56 route** theo spec:
- Public 7,
- Auth/User 7,
- Workspace 30,
- Tenant 7,
- Admin 5,
- System 4 (403 / 404 / 500 / offline).

Bảng chi tiết ở [§9](#9-bảng-tổng-hợp-theo-trang).

- **Bấm được thật (trên mock):**
  - tìm/lọc/phân trang, đặt lịch xem, hủy lịch;
  - đăng ký/đăng nhập/đăng xuất, sửa hồ sơ;
  - CRUD tòa nhà/phòng/người thuê/xe;
  - tạo / kích hoạt / chấm dứt hợp đồng (có cảnh báo trùng ACTIVE);
  - tạo phiên bản đơn giá, ghi chỉ số;
  - xem trước → phát hành hóa đơn, điều chỉnh hóa đơn;
  - ghi nhận / xác nhận / từ chối thanh toán (thanh toán một phần), giao dịch cọc;
  - bảo trì (đổi trạng thái, phân công, trao đổi);
  - thành viên workspace;
  - người thuê gửi chứng từ, liên kết tài khoản;
  - admin khóa user / tạm khóa workspace / gỡ tin.

  Thao tác ở trang này cập nhật dữ liệu ở trang khác, ví dụ phát hành hóa đơn thì dashboard đổi số.
- **Mới chỉ có giao diện / giả lập (có nhãn "Mock" trên UI):**
  - bản đồ (minh họa, chưa có map provider);
  - upload ảnh (chỉ xem trước cục bộ);
  - OTP liên kết tài khoản;
  - quên mật khẩu;
  - gửi email/SMS/Zalo;
  - thanh toán online;
  - xuất báo cáo;
  - tạo workspace mới.
- **Chưa làm (PROPOSED, chờ PO):**
  - lọc theo khoảng cách / đánh giá;
  - Trợ lý tìm trọ thông minh;
  - đánh giá trọ.

  Xem `docs/business/MARKETPLACE_SEARCH_SPEC.md`.
- **Dữ liệu mock** nằm trong bộ nhớ: tải lại trang thì mọi thay đổi bị reset.

**Demo:**
- `demo/desktop-*.png`, `demo/mobile-*.png`: 18 ảnh mỗi loại. Gồm trang chủ, tìm phòng, chi tiết, đặt lịch, đăng nhập, dashboard, phòng, tạo hợp đồng, lập hóa đơn, chi tiết hóa đơn, thanh toán, điện nước, cổng người thuê, admin, 403, lỗi 500 mock.
- `demo/demo-desktop.webm`, `demo/demo-mobile.webm`: video quay chính luồng trên.

## 2. Dữ liệu và API

| Câu hỏi | Trả lời |
|---|---|
| Trang nào dùng mock? | **Tất cả**, khi `VITE_USE_MOCK_API=true` (mặc định) |
| Mock tách khỏi component? | **Có.** Page → hooks (TanStack Query) → `features/*/api.ts` → `mocks/handlers/*.mock.ts` + `mocks/db.ts`. Không page/component nào import dữ liệu mock trực tiếp |
| API client dùng chung? | **Có**, `services/http/httpClient.ts`, viết bằng **fetch, không dùng Axios** (không cần thêm thư viện). Có thể đổi sang Axios nếu team muốn thống nhất; chỉ ảnh hưởng file này |
| TanStack Query? | **Có**, mọi đọc/ghi dữ liệu đều qua `useQuery` / `useMutation`, có invalidation |
| TypeScript types? | **Có**, `features/*/types.ts`: CurrentUser, PublicRoom (listing), Building, WsRoom, Tenant, Contract, Vehicle, RateVersion, MeterReading, Invoice/InvoiceLine, Payment, DepositTx, MaintenanceRequest, Member, Notification, Admin*… Đây là **đề xuất**; khi có `packages/shared` sẽ thay bằng type chính thức |
| Thay mock bằng API thật không viết lại UI? | **Có.** Mỗi `features/*/api.ts` có sẵn object `*Http` gọi endpoint dự kiến. Đặt `VITE_USE_MOCK_API=false` + `VITE_API_BASE_URL`, rồi chỉnh path/DTO trong `*Http` cho khớp backend |

## 3. Authentication

| Câu hỏi | Trả lời |
|---|---|
| Đăng nhập/đăng ký mock hay thật? | **Mock** (4 tài khoản demo). Phần gọi API thật đã viết sẵn trong `features/auth/api.ts`, chờ backend |
| Access token lưu ở đâu? | **Chỉ trong bộ nhớ JS** (`services/http/accessToken.ts`), gửi qua `Authorization: Bearer` |
| Refresh token có trong localStorage/sessionStorage? | **Không.** Refresh token là cookie HttpOnly do backend set; frontend không đọc/ghi. Mọi request gửi `credentials: 'include'`. (Chế độ mock lưu **userId demo** trong `sessionStorage` để giả lập phiên — không phải token, không dùng khi chạy API thật. `localStorage` chỉ lưu id workspace gần nhất.) |
| Protected routes, xử lý 401/403? | **Có.** Guard: `RequireAuth`, `RequireAdmin`, `RequireLinkedTenant`, `GuestOnly`, kiểm tra membership trong `WorkspaceLayout`. Khi gặp 401: refresh một lần, gửi lại request; nếu vẫn lỗi thì hiện hộp thoại "Phiên đăng nhập đã hết hạn". Khi gặp 403: trang/khối "Bạn không có quyền" |
| Loading khi kiểm tra phiên? | **Có**, skeleton "Đang kiểm tra phiên đăng nhập…" trước khi quyết định chuyển hướng |

**Theo hướng backend (JWT access ngắn hạn trong memory + refresh HttpOnly cookie):**
- Login/register nhận `{ accessToken, user }` và giữ token trong memory.
- Gặp 401 thì gọi `POST /auth/refresh`. Nhiều request 401 cùng lúc chỉ refresh **1 lần**, tránh bị backend coi là dùng lại refresh token.
- Khi tải lại trang: refresh trước, rồi gọi `/auth/me`.
- Logout: gọi `/auth/logout` và xóa token.
- **Path và DTO auth là dự kiến, chưa chốt với backend.** Có 6 unit test cho luồng này trong `httpClient.test.ts`.

## 4. Phân quyền

| Câu hỏi | Trả lời |
|---|---|
| Tách 4 giao diện? | **Có**: `PublicLayout` (+`UserLayout`), `WorkspaceLayout`, `TenantLayout`, `AdminLayout`; thanh chuyển khu vực ẩn tab không đủ quyền |
| Chủ trọ chỉ thấy workspace của mình? | **Có (UI + mock)**. Danh sách workspace lấy từ membership của chính user. Mở URL workspace khác → 403 (có e2e test) |
| Người thuê chỉ xem dữ liệu của mình? | **Có (UI + mock)**. Mock lọc theo hồ sơ thuê đã liên kết. Chưa liên kết → chuyển tới trang liên kết |
| Admin có sửa hóa đơn/hợp đồng/điện nước/xác nhận thanh toán? | **Không.** Admin chỉ có: dashboard tổng hợp, khóa/mở user, ACTIVE↔SUSPENDED workspace, gỡ/khôi phục tin, audit log. Không có màn hình hay API client nào cho Admin sửa dữ liệu tài chính |

> Ẩn nút theo role chỉ là UX. **Backend bắt buộc kiểm tra quyền thật** (đã ghi trong code, tài liệu và `docs/business/ROLE_PERMISSIONS.md`).

## 5. Trạng thái API trên từng trang

- **Loading / error / empty:**
  - **Có** ở mọi trang dữ liệu: skeleton, `ErrorState` (thông điệp riêng cho 401/403/404/mất mạng, nút "Thử lại"), `EmptyState`.
  - Kiểm tra được bằng `?mock=500|empty|slow|403|network`.
- **Validation form:**
  - **Có** (react-hook-form + zod).
  - Lỗi server 400/409 có `fieldErrors` được gắn vào đúng ô; lỗi khác hiện bằng toast.
  - Form tạo/sửa có cảnh báo khi rời trang mà chưa lưu.
- **Pagination / filter / search:**
  - Marketplace: phân trang + lọc + sắp xếp, đồng bộ trên URL.
  - Danh sách trong workspace: lọc/tìm (đồng bộ URL), **chưa phân trang phía server** (cần chốt với backend).
- **Tránh gọi trùng / tự retry:**
  - Mutation (tạo dữ liệu, thanh toán…) **không tự retry**.
  - Nút submit bị vô hiệu trong lúc gửi.
  - Query chỉ retry 1 lần với lỗi mạng/5xx, không retry 4xx.
  - Ngoại lệ duy nhất: request bị 401 được gửi lại đúng 1 lần sau refresh. An toàn vì backend chưa xử lý request đó.
  - **Chưa có** header `Idempotency-Key` cho lập hóa đơn / xác nhận thanh toán (BRD yêu cầu idempotency). Cần chốt tên header với backend.

## 6. Cấu trúc source

```
apps/web/
├── .env.example            # VITE_API_BASE_URL, VITE_USE_MOCK_API (không có .env thật)
├── e2e/smoke.spec.ts       # Playwright
├── src/
│   ├── app/                # App.tsx (providers), router.tsx, guards.tsx, queryClient.ts
│   ├── layouts/            # Public, User, Workspace, Tenant, Admin, AppShell + parts/
│   ├── pages/              # public/ auth/ user/ workspace/ tenant/ admin/ system/
│   ├── features/<domain>/  # types.ts, api.ts (mock|http), hooks.ts, labels.ts, schemas.ts
│   │                       # auth, rooms, viewings, workspaces, dashboard, property, leasing,
│   │                       # billing (+calc.ts), maintenance, members, notifications,
│   │                       # tenant-portal, reports, admin
│   ├── components/ui/      # Button, DataTable, FormField, Modal, Toast, ImageUploader…
│   ├── components/charts/  # BarChart, DonutChart
│   ├── services/http/      # httpClient.ts, accessToken.ts, ApiError.ts
│   ├── mocks/              # db.ts, data/, handlers/*.mock.ts, mockUtils.ts, session.ts
│   ├── hooks/ lib/ styles/ types/ test/
```

| Thành phần | File |
|---|---|
| API client | `src/services/http/httpClient.ts` |
| Access token (memory) | `src/services/http/accessToken.ts` |
| Mock adapter | `src/mocks/handlers/*.mock.ts`, dữ liệu `src/mocks/db.ts` |
| Hooks dữ liệu | `src/features/*/hooks.ts` (một số domain nằm trong `api.ts`) |
| Types | `src/features/*/types.ts`, `src/types/api.ts` |
| Auth state | TanStack Query key `['auth','me']` (`features/auth/hooks.ts`) + `accessToken.ts` |
| Router / guard | `src/app/router.tsx`, `src/app/guards.tsx` |
| Env mẫu | `apps/web/.env.example`. `.env` đã nằm trong `.gitignore` |

## 7. Kiểm thử

Chạy local:

```bash
cd apps/web
npm install
cp .env.example .env
npm run dev                          # http://localhost:5173
npm run typecheck && npm run lint && npm run test && npm run build
PW_CHANNEL=msedge npm run test:e2e   # hoặc: npx playwright install chromium && npm run test:e2e
```

Kết quả lần chạy 14/10/2026:

| Lệnh | Kết quả |
|---|---|
| `npm run typecheck` | ✅ 0 lỗi |
| `npm run lint` | ✅ 0 lỗi, 9 cảnh báo `react-refresh/only-export-components` (chỉ ảnh hưởng hot reload) |
| `npm run test` (Vitest) | ✅ 38/38 test (5 file) |
| `npm run build` | ✅ |
| `npm run test:e2e` (Playwright, desktop + mobile) | ✅ 14/14, gồm đi qua cả 30 route workspace và luồng F1–F6 |

**Lỗi / giới hạn còn tồn tại:**
1. Toàn bộ dữ liệu là mock; reset khi tải lại trang.
2. Endpoint/DTO đều là **dự kiến**, chưa đối chiếu backend; auth path/DTO chưa chốt.
3. Trạng thái lệch BRD:
   - hợp đồng có `TERMINATED` (BRD: `ENDED` / `CANCELLED`);
   - hóa đơn hiển thị `PARTIALLY_PAID` / `OVERDUE` (là trạng thái suy ra);
   - Payment thiếu `CANCELLED`.
   Cần sửa khi tích hợp.
4. Chưa có `Idempotency-Key`; danh sách trong workspace chưa phân trang server.
5. Map, upload ảnh, OTP, thông báo ngoài app, thanh toán online, xuất báo cáo: chưa có thật.
6. Bundle production vẫn chứa code mock (nên tách bằng dynamic import khi tích hợp).
7. Sau khi chủ trọ duyệt liên kết, người thuê phải đăng nhập lại mới vào được Cổng người thuê.
8. Bảng "Hóa đơn cần thu" trên dashboard cuộn ngang ở màn hình ~1280–1440px.
9. Ảnh phòng mock lấy từ Unsplash; font từ Google Fonts. Offline thì dùng ảnh/font dự phòng.
10. Chưa tải được Chromium của Playwright (bị treo khi tải), e2e đang chạy bằng Edge có sẵn trên máy.

## 8. GitHub và bàn giao

- **Vị trí hiện tại:**
  - Repo local `Web Nâng Cao Trên lớp`, remote `origin` = `github.com/hoangkhai11/Web_Nang_Cao` (repo dự án TimPhongTro cũ), branch `main`.
  - Code frontend (`apps/web`, `docs/`) đang **chưa được git theo dõi, chưa commit, chưa push**.
- Trong working tree còn có các file `TimPhongTro/*` và `.gitignore` gốc ở trạng thái **đã xóa nhưng chưa commit**. Thay đổi này có từ trước, không do phía frontend thực hiện.
- **Chưa có thao tác git nào** từ phía frontend: không tạo branch, commit, push hay PR. Không ghi đè backend hay monorepo.
- **Đề xuất:**
  - **Không** push lên `main` của repo này.
  - Khi đã thống nhất repo chung: tạo branch `feat/frontend-v1`, chỉ đưa thư mục `apps/web` (và `docs/frontend`, `docs/business` nếu cần), mở Pull Request để review trước khi merge.
  - Nếu chưa có repo chung thì giữ nguyên source như hiện tại.

## 9. Bảng tổng hợp theo trang

Chú thích:
- **UI:** ✅ hoàn chỉnh · 🧩 hoàn chỉnh nhưng có phần giả lập · ⬜ chưa làm.
- **Dữ liệu:** "Mock" = chạy bằng mock adapter, đã có sẵn client `*Http` cho API thật.
- **API cần backend:** đường dẫn dự kiến, prefix `/api/v1`, chưa chốt.

| Trang | Route | UI | Mock/API | API cần backend cung cấp | Ghi chú |
|---|---|---|---|---|---|
| Trang chủ | `/` | ✅ | Mock | `GET /marketplace/rooms/featured`, `GET /marketplace/stats`, `GET /marketplace/districts` | Theo ảnh demo 2 |
| Danh sách phòng | `/rooms` | ✅ | Mock | `GET /marketplace/rooms?district&priceMin&priceMax&areaMin&occupants&roomType&amenities&sort&page&pageSize` | Lọc/sort/phân trang đồng bộ URL |
| Chi tiết phòng | `/rooms/:roomId` | ✅ | Mock | `GET /marketplace/rooms/:id` | SĐT chủ trọ đang che |
| Bản đồ | `/rooms/map` | 🧩 | Mock | như `/rooms` + tọa độ | Bản đồ minh họa; chờ chốt map provider |
| Đặt lịch xem | `/rooms/:id/viewing` | ✅ | Mock | `POST /viewings` | Khách chưa đăng nhập có được đặt không: chờ chốt |
| Giới thiệu / Trợ giúp | `/about`, `/help` | ✅ / 🧩 | Tĩnh | — | Kênh liên hệ chưa có |
| Đăng nhập | `/login` | ✅ | Mock | `POST /auth/login` → `{accessToken,user}`, `POST /auth/refresh`, `GET /auth/me` | Token trong memory |
| Đăng ký | `/register` | ✅ | Mock | `POST /auth/register` | Lỗi 409 hiển thị theo field |
| Quên mật khẩu | `/forgot-password` | 🧩 | Mock | `POST /auth/forgot-password` (+ reset) | Luồng reset chưa chốt |
| Hồ sơ | `/account` | ✅ | Mock | `PATCH /users/me` | Đổi email chờ API xác minh |
| Lịch xem của tôi | `/my-viewings` | ✅ | Mock | `GET /viewings/me`, `POST /viewings/:id/cancel` | |
| Thông báo | `/notifications` | 🧩 | Mock | `GET /notifications`, `POST /notifications/:id/read`, `POST /notifications/read-all` | Chỉ trong app |
| Chọn workspace | `/workspaces/select` | ✅ | Mock | `GET /workspaces/me` | Tạo workspace mới chờ API |
| Dashboard chủ trọ | `/w/:ws/dashboard` | ✅ | Mock | `GET /workspaces/:ws/dashboard` (hoặc gộp nhiều endpoint) | Theo ảnh demo 1; số liệu tính từ dữ liệu |
| Cài đặt workspace | `/w/:ws/settings` | ✅ | Mock | `GET/PATCH /workspaces/:ws/settings` | Chỉ OWNER |
| Thành viên | `/w/:ws/members` | 🧩 | Mock | `GET/POST /workspaces/:ws/members`, `PATCH/DELETE …/:id` | Email mời chưa gửi thật |
| Tòa nhà (DS / tạo / chi tiết / sửa) | `/w/:ws/buildings…` | ✅ | Mock | `GET/POST /workspaces/:ws/buildings`, `GET/PATCH …/:id` | |
| Phòng (DS / tạo / chi tiết / sửa) | `/w/:ws/rooms…` | 🧩 | Mock | `GET/POST /workspaces/:ws/rooms`, `GET/PATCH …/:id`, `PATCH …/:id/listing`, upload ảnh | Upload ảnh chỉ preview |
| Lịch xem (chủ trọ) | `/w/:ws/viewings` | ✅ | Mock | `GET /workspaces/:ws/viewings`, `PATCH …/:id` | |
| Người thuê (DS / tạo / chi tiết / sửa) | `/w/:ws/tenants…` | ✅ | Mock | `GET/POST /workspaces/:ws/tenants`, `GET/PATCH …/:id`, `POST …/:id/link-request/{approve\|reject}` | Không tự liên kết theo SĐT |
| Hợp đồng (DS / tạo / chi tiết / sửa nháp) | `/w/:ws/contracts…` | ✅ | Mock | `GET/POST /workspaces/:ws/contracts`, `GET/PATCH …/:id`, `POST …/:id/activate`, `POST …/:id/terminate` | Cảnh báo trùng ACTIVE trên UI; 409 từ backend; trạng thái cần khớp BRD |
| Phương tiện | `/w/:ws/vehicles` | ✅ | Mock | `GET/POST /workspaces/:ws/vehicles`, `PATCH/DELETE …/:id` | |
| Bảng giá dịch vụ | `/w/:ws/rates` | ✅ | Mock | `GET/POST /workspaces/:ws/rates` | Phiên bản effectiveFrom |
| Chỉ số điện nước | `/w/:ws/meters` | ✅ | Mock | `GET /workspaces/:ws/meter-readings?period`, `POST …/meter-readings` | |
| Hóa đơn (DS / chi tiết) | `/w/:ws/invoices…` | ✅ | Mock | `GET /workspaces/:ws/invoices`, `GET …/:id`, `POST …/:id/adjustments` | Cần trạng thái thanh toán suy ra từ backend |
| Lập hóa đơn tháng | `/w/:ws/billing/run` | ✅ | Mock | `POST /workspaces/:ws/billing/preview`, `POST …/billing/run` | Cần idempotency |
| Thanh toán | `/w/:ws/payments` | ✅ | Mock | `GET /workspaces/:ws/payments`, `POST …/payments`, `POST …/:id/confirm`, `POST …/:id/reject` | Cần idempotency; thanh toán một phần |
| Tiền cọc | `/w/:ws/deposits` | ✅ | Mock | `GET/POST /workspaces/:ws/deposits` | Tách doanh thu |
| Bảo trì (DS / chi tiết) | `/w/:ws/maintenance…` | ✅ | Mock | `GET/POST /workspaces/:ws/maintenance`, `GET/PATCH …/:id`, `POST …/:id/comments` | |
| Báo cáo | `/w/:ws/reports` | 🧩 | Mock | `GET /workspaces/:ws/reports?from&to` | Xuất file chưa có |
| Cổng người thuê — tổng quan | `/tenant` | ✅ | Mock | `GET /tenant/overview` | |
| Hợp đồng của tôi | `/tenant/contracts` | ✅ | Mock | `GET /tenant/contracts` | |
| Hóa đơn của tôi (DS / chi tiết) | `/tenant/invoices…` | 🧩 | Mock | `GET /tenant/invoices`, `GET /tenant/invoices/:id` (kèm thông tin chuyển khoản) | Không có cổng thanh toán online |
| Gửi thanh toán | `/tenant/payments/new` | 🧩 | Mock | `POST /tenant/payments` + upload chứng từ | Upload chỉ preview |
| Bảo trì (người thuê) | `/tenant/maintenance` | ✅ | Mock | `GET/POST /tenant/maintenance` | |
| Liên kết hồ sơ thuê | `/tenant/link-account` | 🧩 | Mock | `GET/POST /tenant/link-requests` + gửi OTP | OTP giả lập (`123456`) |
| Admin — dashboard | `/admin` | ✅ | Mock | `GET /admin/overview` | Chỉ số tổng hợp |
| Admin — người dùng | `/admin/users` | ✅ | Mock | `GET /admin/users`, `PATCH /admin/users/:id` | Khóa/mở |
| Admin — workspace | `/admin/workspaces` | ✅ | Mock | `GET /admin/workspaces`, `PATCH /admin/workspaces/:id` | ACTIVE ↔ SUSPENDED |
| Admin — tin đăng | `/admin/listings` | ✅ | Mock | `GET /admin/listings`, `PATCH /admin/listings/:id` | Gỡ tin không xóa phòng/hợp đồng |
| Admin — audit log | `/admin/audit-logs` | ✅ | Mock | `GET /admin/audit-logs?q&category&from&to` | |
| 403 / 404 / 500 / Offline | `/403`, `*`, `/500`, `/offline` | ✅ | — | — | + hộp thoại hết phiên, banner mất mạng |
| Lọc khoảng cách / đánh giá | `/rooms` (mở rộng) | ⬜ | — | xem `MARKETPLACE_SEARCH_SPEC.md` | PROPOSED |
| Trợ lý tìm trọ thông minh | `/rooms/smart-search` | ⬜ | — | `POST /listings/recommendations` (đề xuất) | PROPOSED (P04-B) |
| Đánh giá trọ | `/tenant/reviews`, `/admin/reviews` | ⬜ | — | chưa thiết kế | PROPOSED |
