# TimPhongTro

Website đăng tin & tìm phòng trọ (dạng classifieds): người dùng đăng ký, đăng tin cho thuê phòng, tìm kiếm/lọc phòng, lưu tin yêu thích và gửi yêu cầu liên hệ xem phòng; Admin kiểm duyệt tin đăng, quản lý người dùng và yêu cầu liên hệ. Kết nối trực tiếp tới cơ sở dữ liệu MySQL.

## 1. Nhóm thực hiện

| Họ tên | Mã sinh viên |
|---|---|
| _Điền tên thành viên 1_ | _MSSV_ |
| _Điền tên thành viên 2_ | _MSSV_ |
| _Điền tên thành viên 3_ | _MSSV_ |

## 2. Giới thiệu

**TimPhongTro** giúp người thuê trọ tìm phòng phù hợp qua bộ lọc khu vực/giá/diện tích, xem chi tiết từng tin đăng, lưu lại tin quan tâm và gửi yêu cầu liên hệ trực tiếp tới người đăng. Bất kỳ người dùng nào cũng có thể tự đăng tin cho thuê phòng của mình — tin đăng cần Admin duyệt trước khi hiển thị công khai, giúp hạn chế tin rác/tin sai sự thật.

## 3. Tính năng

**Đăng ký & đăng nhập:**
- Ai cũng có thể tự đăng ký tài khoản (họ tên, email, số điện thoại, mật khẩu) và đăng nhập ngay sau khi đăng ký.
- Token đăng nhập (JWT) được lưu ở `localStorage` để giữ phiên đăng nhập xuyên suốt nhiều trang.

**Vai trò Người dùng:**
- Tìm kiếm & lọc phòng theo từ khóa, quận/huyện, khoảng giá.
- Xem chi tiết tin đăng (mô tả, giá, diện tích, thông tin người đăng).
- Lưu tin yêu thích để xem lại sau, bỏ lưu bất cứ lúc nào.
- Gửi yêu cầu liên hệ/xem phòng (họ tên, số điện thoại, lời nhắn) cho một tin đăng.
- Xem lại các yêu cầu mình đã gửi và trạng thái xử lý.
- Tự đăng tin cho thuê phòng của mình (tin vào trạng thái **chờ duyệt**), sửa/xóa tin của chính mình — sửa tin sẽ đưa tin về trạng thái chờ duyệt lại.
- Quản lý hồ sơ cá nhân: cập nhật họ tên/số điện thoại, đổi mật khẩu.

**Vai trò Admin:**
- Dashboard tổng quan: tổng số tin đăng, số tin chờ duyệt/đã duyệt/từ chối/đã ẩn, tổng người dùng, số yêu cầu chờ xử lý, biểu đồ số tin đã duyệt theo khu vực.
- Quản lý phòng: xem/thêm/sửa/xóa mọi tin đăng trong hệ thống (tin do Admin tạo được duyệt ngay).
- Duyệt tin: hàng đợi kiểm duyệt tin do người dùng gửi — Duyệt / Từ chối / Ẩn.
- Quản lý người dùng: xem danh sách, xóa tài khoản (không thể tự xóa tài khoản đang đăng nhập hoặc xóa Admin cuối cùng).
- Quản lý yêu cầu liên hệ: xem toàn bộ yêu cầu, cập nhật trạng thái xử lý (chờ xử lý / đã liên hệ / đã xử lý / đã hủy).

## 4. Kiến trúc hệ thống

Mô hình 3 lớp: **Trình duyệt (frontend, nhiều trang HTML) → Server Node.js/Express (backend, xác thực JWT) → MySQL (dữ liệu)**.

![Sơ đồ kiến trúc](docs/architecture.png)

- Frontend: `web/` — HTML/CSS/JS thuần, nhiều trang (không phải SPA), gọi API bằng `fetch()`, gắn token JWT trong header `Authorization`. `web/js/api.js` là lớp gọi API dùng chung, `web/js/auth.js` dựng thanh điều hướng và các luồng đăng nhập/đăng ký/đăng xuất dùng chung cho mọi trang.
- Backend: `server/` — tách theo lớp `routes` (khai báo endpoint) → `controllers` (nhận request, gọi service, trả response) → `services` (nghiệp vụ + truy vấn CSDL qua `mysql2`). `middleware/auth.js` xác thực JWT, `middleware/admin.js` giới hạn quyền Admin.
- Database: MySQL/MariaDB, script khởi tạo tại `database/tim_phong_tro.sql`.

*(File nguồn Graphviz `.dot` cho sơ đồ đi kèm trong `docs/`, dùng `dot -Tpng ten_file.dot -o ten_file.png` hoặc trình xem `.dot` online để xuất hình PNG.)*

## 5. Phân tích bài toán

### 5.1. Phân tích các đối tượng

| Lớp | Vai trò | Thuộc tính chính |
|---|---|---|
| `NguoiDung` | Tài khoản đăng nhập (Admin hoặc người dùng thường) | `maNguoiDung`, `hoTen`, `email`, `soDienThoai`, `vaiTro` |
| `Phong` | Tin đăng cho thuê phòng trọ | `maPhong`, `tieuDe`, `moTa`, `diaChi`, `quanHuyen`, `gia`, `dienTich`, `trangThai`, `maNguoiDang` |
| `PhongYeuThich` | Bảng trung gian: tin nào được người dùng nào lưu | `maYeuThich`, `maNguoiDung`, `maPhong`, `ngayLuu` |
| `YeuCau` | Yêu cầu liên hệ/xem phòng của người dùng gửi tới một tin đăng | `maYeuCau`, `maNguoiDung`, `maPhong`, `hoTenLienHe`, `soDienThoaiLienHe`, `trangThai` |

### 5.2. Phân tích mối quan hệ giữa các đối tượng

| Quan hệ | Bản chất | Cardinality |
|---|---|---|
| `NguoiDung` – `Phong` | Một người dùng có thể đăng nhiều tin | 1 – N |
| `NguoiDung` – `PhongYeuThich` – `Phong` | Một người dùng lưu nhiều tin, một tin được nhiều người lưu | N – N (qua bảng trung gian) |
| `NguoiDung` – `YeuCau` | Một người dùng gửi nhiều yêu cầu liên hệ | 1 – N |
| `Phong` – `YeuCau` | Một tin đăng có thể nhận nhiều yêu cầu liên hệ | 1 – N |

```
NguoiDung 1 -------- N Phong 1 -------- N YeuCau
     |                    |
     1                    1
     |                    |
     N                    N
PhongYeuThich N -------- 1 Phong (qua PhongYeuThich)
```

Sơ đồ ERD chi tiết: `docs/erd.dot` (nguồn Graphviz, xuất PNG như hướng dẫn ở mục 4).

## 6. Cơ sở dữ liệu

File `database/tim_phong_tro.sql` bao gồm:
- Lệnh tạo 4 bảng (`NguoiDung`, `Phong`, `PhongYeuThich`, `YeuCau`) cùng đầy đủ khóa chính, khóa ngoại.
- Dữ liệu mẫu: 1 tài khoản Admin, 2 người dùng, 6 tin đăng (đủ các trạng thái chờ duyệt/đã duyệt/từ chối), một vài tin đã lưu và yêu cầu liên hệ mẫu.
- Lệnh tạo user CSDL riêng cho ứng dụng (`timphongtro_app`), tách biệt khỏi tài khoản `root`.

Ràng buộc khóa ngoại bảo vệ dữ liệu: không thể xóa một người dùng/phòng đang được tham chiếu bởi dữ liệu khác nếu vi phạm ràng buộc (trừ `PhongYeuThich` được cấu hình `ON DELETE CASCADE` vì chỉ là liên kết "đã lưu"); backend bắt lỗi này và trả về thông báo rõ ràng.

## 7. Cài đặt và chạy dự án

**Yêu cầu:** Node.js ≥ 18, MySQL hoặc MariaDB đang chạy.

1. **Import cơ sở dữ liệu** (đã gồm cả tạo bảng, dữ liệu mẫu và user `timphongtro_app`):
   ```bash
   mysql -u root -p < database/tim_phong_tro.sql
   ```
2. **Cấu hình kết nối:**
   ```bash
   cd server
   cp .env.example .env
   ```
   Mở `.env` và đổi `JWT_SECRET` cùng mật khẩu `timphongtro_app` sang giá trị riêng trước khi triển khai thật.
3. **Cài đặt & chạy backend:**
   ```bash
   npm install
   npm start
   ```
4. Mở trình duyệt tại **http://localhost:4000** — server tự phục vụ luôn giao diện web (`web/`) lẫn API, không cần mở file `.html` trực tiếp.

## 8. Tài khoản có sẵn (từ dữ liệu mẫu)

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | `admin@timphongtro.vn` | `admin123` |
| Người dùng | `an.nguyen@example.com` | `user123` |
| Người dùng | `binh.tran@example.com` | `user123` |

> Đổi mật khẩu các tài khoản này cùng với `JWT_SECRET` trước khi triển khai thật. Ai cũng có thể tự đăng ký tài khoản mới ở trang `/pages/register.html`.

## 9. Tổng quan API

Tất cả endpoint (trừ `/api/auth/login`, `/api/auth/register` và các endpoint GET công khai của `/api/rooms`) yêu cầu header `Authorization: Bearer <token>`. Nhóm `/api/admin/...` và các route đánh dấu (Admin) chỉ Admin mới gọi được.

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập, trả về JWT |
| GET | `/api/auth/me` | Thông tin từ token hiện tại |
| GET | `/api/rooms` | Danh sách phòng đã duyệt (công khai, có filter `q`, `quanHuyen`, `giaMin`, `giaMax`, `dienTichMin`) |
| GET | `/api/rooms/:id` | Chi tiết một phòng đã duyệt (công khai) |
| GET | `/api/rooms/mine` | Tin đăng của chính người dùng (mọi trạng thái) |
| POST | `/api/rooms` | Đăng tin mới (chờ duyệt, trừ khi Admin đăng thì duyệt ngay) |
| PUT/DELETE | `/api/rooms/:id` | Sửa/xóa tin — chủ tin hoặc Admin |
| GET/PUT | `/api/users/me` | Xem/cập nhật hồ sơ cá nhân |
| PUT | `/api/users/me/matkhau` | Đổi mật khẩu |
| GET/DELETE | `/api/users`, `/api/users/:id` | Quản lý người dùng (Admin) |
| POST | `/api/requests` | Gửi yêu cầu liên hệ cho một tin đăng |
| GET | `/api/requests/me` | Yêu cầu của chính mình |
| GET/PUT | `/api/requests`, `/api/requests/:id/trangthai` | Quản lý mọi yêu cầu (Admin) |
| GET/POST/DELETE | `/api/saved`, `/api/saved/:maPhong` | Lưu/bỏ lưu/xem tin đã lưu |
| GET | `/api/admin/dashboard` | Số liệu tổng hợp cho trang Tổng quan (Admin) |
| GET/PUT | `/api/admin/rooms`, `/api/admin/rooms/:id/trangthai` | Danh sách đầy đủ & duyệt/từ chối/ẩn tin (Admin) |

## 10. Bảo mật

- Mật khẩu băm bằng **bcrypt**, không lưu plain text.
- Đăng nhập cấp **JWT** (hết hạn sau 8 giờ), mọi API cần xác thực đều kiểm tra token qua middleware `auth`.
- Phân quyền chặt ở **tầng backend** (`middleware/admin.js`): người dùng thường gọi API quản trị sẽ nhận lỗi `403`, không chỉ ẩn nút trên giao diện.
- Chủ tin hoặc Admin mới được sửa/xóa một tin đăng — kiểm tra `maNguoiDang` so với người gọi API, không tin dữ liệu client tự gửi.
- Toàn bộ truy vấn dùng **prepared statements** (`mysql2`), tránh SQL Injection.
- Backend kết nối CSDL bằng user riêng (`timphongtro_app`), không dùng `root`.
- Token lưu ở `localStorage` để giữ phiên qua nhiều trang HTML — đây là lựa chọn phù hợp cho bản demo; khi triển khai thật nên chuyển sang cookie `httpOnly` để hạn chế rủi ro XSS đọc được token.

## 11. Cấu trúc thư mục

```
TimPhongTro/
├── README.md
├── database/
│   └── tim_phong_tro.sql
├── docs/
│   ├── erd.dot                # Nguồn Graphviz cho ERD
│   ├── architecture.dot       # Nguồn Graphviz cho sơ đồ kiến trúc
│   ├── erd.png                # Xuất từ erd.dot (tự tạo bằng Graphviz)
│   └── architecture.png       # Xuất từ architecture.dot (tự tạo bằng Graphviz)
├── server/                    # Backend Node.js/Express
│   ├── server.js
│   ├── package.json
│   ├── .env / .env.example
│   ├── config/db.js
│   ├── middleware/ (auth.js, admin.js)
│   ├── routes/     (auth, room, user, request, saved, admin)
│   ├── controllers/(auth, room, user, request, saved, admin)
│   └── services/   (auth, room, request, admin)
└── web/                       # Frontend (nhiều trang HTML thuần)
    ├── index.html
    ├── pages/ (login, register, rooms, room-detail, profile, saved, requests, admin/...)
    ├── css/   (common, home, rooms, room-detail, admin)
    └── js/    (api, auth, home, rooms, room-detail, profile, saved, requests, admin/...)
```

## 12. Hướng phát triển thêm

- Upload nhiều ảnh cho một tin đăng thay vì chỉ một link ảnh.
- Phân trang cho danh sách tin đăng khi dữ liệu lớn.
- Thông báo qua email khi tin được duyệt/từ chối hoặc có yêu cầu liên hệ mới.
- Chuyển sang cookie `httpOnly` + refresh token cho phiên đăng nhập dài hạn.
- Cho phép Admin nhắn tin trực tiếp phản hồi từng yêu cầu liên hệ trong hệ thống.
