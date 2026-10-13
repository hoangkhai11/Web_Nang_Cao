# Rental Platform V1.0 — Đặc tả phân quyền theo vai trò

> Addendum cho BRD/SRS V1.0. Cập nhật 14/10/2026. Quy ước trạng thái: xem [BUSINESS_REQUIREMENTS.md](BUSINESS_REQUIREMENTS.md#quy-ước-trạng-thái).
> **Nguyên tắc chung:** UI chỉ ẩn/hiện thao tác; **backend là nơi kiểm tra quyền bắt buộc** (FR-AUTH-05). Mọi truy vấn của workspace phải giới hạn theo `workspace_id` (BR-11).

## 1. Nguồn quyền

| Nguồn | Giá trị | Phạm vi |
|---|---|---|
| Global role (`users`) | `USER`, `ADMIN` | Toàn nền tảng. **Không có `LANDLORD`** |
| Workspace membership | `OWNER`, `MANAGER`, `STAFF` (STAFF mở rộng theo OD-02) | Chỉ trong workspace đó |
| Tenant–User link | Liên kết đã xác minh, chưa thu hồi | Chỉ dữ liệu của hợp đồng/hồ sơ thuê được liên kết |

Một User có thể nắm nhiều nguồn quyền cùng lúc. Quyền **không cộng dồn chéo ngữ cảnh**: là OWNER ở workspace A không cho quyền gì ở workspace B.

## 2. Ma trận quyền nghiệp vụ

Ký hiệu: ✅ được · 👁 chỉ xem · ❌ không được · — không áp dụng.
Quyền MANAGER/STAFF là **đề xuất** theo OD-02, chờ chốt.

| Nghiệp vụ | Khách | USER | Tenant (đã liên kết) | STAFF | MANAGER | OWNER | ADMIN |
|---|---|---|---|---|---|---|---|
| Xem tin đăng công khai, tìm kiếm, bản đồ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Đặt lịch xem phòng | Theo chính sách (cần chốt) | ✅ | ✅ | — | — | — | — |
| Đánh giá trọ (PROPOSED) | ❌ | ❌ | ✅ nếu đủ điều kiện | — | — | — | — |
| Cài đặt workspace, thành viên | — | — | — | ❌ | ❌ | ✅ | ❌ |
| Tòa nhà, phòng, ảnh, tiện ích | — | — | — | ✅ | ✅ | ✅ | ❌ |
| Đăng / ẩn tin phòng của mình | — | — | — | ✅ | ✅ | ✅ | ❌ (chỉ kiểm duyệt, xem §3) |
| Người thuê, thành viên ở, liên kết tài khoản | — | — | 👁 hồ sơ của mình | ✅ | ✅ | ✅ | ❌ |
| Hợp đồng | — | — | 👁 của mình | ✅ | ✅ | ✅ | ❌ |
| Xe & phí gửi xe | — | — | 👁 của mình | ✅ | ✅ | ✅ | ❌ |
| Biểu giá điện/nước/dịch vụ | — | — | 👁 trên hóa đơn | ❌ | ✅ | ✅ | ❌ |
| Chỉ số điện nước | — | — | 👁 trên hóa đơn | ✅ | ✅ | ✅ | ❌ |
| Lập / điều chỉnh / hủy hóa đơn | — | — | 👁 của mình | ❌ | ✅ | ✅ | ❌ |
| Gửi chứng từ thanh toán | — | — | ✅ | — | — | — | ❌ |
| Xác nhận / từ chối thanh toán, công nợ | — | — | ❌ | ❌ | ✅ | ✅ | ❌ |
| Giao dịch tiền cọc | — | — | 👁 của mình | ❌ | ✅ | ✅ | ❌ |
| Yêu cầu bảo trì | — | — | ✅ tạo & theo dõi | ✅ xử lý | ✅ | ✅ | ❌ |
| Thống kê workspace | — | — | — | 👁 (cần chốt) | ✅ | ✅ | ❌ chi tiết; ✅ tổng hợp ẩn danh toàn nền tảng |
| Tài khoản nền tảng, khóa/mở | — | — | — | — | — | — | ✅ |
| Kiểm duyệt tin đăng, đánh giá, khiếu nại | — | — | — | — | — | — | ✅ |
| Audit log | — | — | — | — | — | 👁 của workspace (đề xuất) | ✅ phạm vi vận hành |

## 3. Platform Admin — QUYẾT ĐỊNH ĐÃ CHỐT

> **Admin KHÔNG được tự ý sửa dữ liệu tài chính và nghiệp vụ riêng của chủ trọ.** (Chủ dự án, D-03)

### 3.1 Admin được

- Quản lý tài khoản nền tảng: tra cứu, xem thông tin tài khoản ở mức vận hành.
- Khóa/mở tài khoản vi phạm theo chính sách. Tài khoản bị khóa không tạo được phiên mới (FR-AUTH-05).
- Kiểm duyệt, ẩn, gỡ **tin đăng công khai** (listing).
- Kiểm duyệt **đánh giá trọ** vi phạm (ẩn/gỡ), nếu tính năng đánh giá được duyệt (PROPOSED).
- Tiếp nhận và xử lý báo cáo, khiếu nại.
- Xem thống kê **tổng hợp** toàn nền tảng (số user, workspace, tin đăng…). Phải tách:
  - tiền thu của chủ trọ,
  - giá trị giao dịch qua nền tảng,
  - doanh thu thực của nền tảng (FR-ADMIN-03).
- Quản lý cấu hình và danh mục chung: danh mục tiện ích, loại phòng, khu vực, tham số hệ thống.
- Xem audit log phù hợp quyền vận hành.
- Tạm khóa workspace (ACTIVE ↔ SUSPENDED) theo chính sách vi phạm. Thao tác này chặn hoạt động nhưng không sửa dữ liệu bên trong.

### 3.2 Admin KHÔNG được

| # | Hành vi bị cấm |
|---|---|
| A-01 | Sửa giá thuê, giá điện, giá nước hoặc phí dịch vụ của chủ trọ |
| A-02 | Sửa chỉ số điện nước |
| A-03 | Tạo / sửa / xóa hóa đơn thay chủ trọ |
| A-04 | Xác nhận thanh toán hoặc điều chỉnh công nợ thay chủ trọ |
| A-05 | Sửa hợp đồng, tiền cọc hoặc giao dịch tiền cọc |
| A-06 | Tự ý chuyển người thuê giữa các phòng |
| A-07 | Xóa dữ liệu phòng / hợp đồng gốc chỉ vì gỡ một tin đăng |

### 3.3 Phân biệt LISTING và dữ liệu workspace

| Đối tượng | Thuộc về | Admin |
|---|---|---|
| **LISTING** (trạng thái hiển thị công khai của phòng trên Marketplace) | Lớp công khai của nền tảng | ✅ Ẩn / gỡ / khôi phục (kiểm duyệt) |
| **ROOM, CONTRACT, INVOICE, PAYMENT**, deposit, meter reading, rate | Nghiệp vụ của workspace | ❌ Không tạo/sửa/xóa |

Gỡ listing chỉ đổi trạng thái hiển thị (và ghi audit). Phòng, hợp đồng, hóa đơn liên quan giữ nguyên (BR-P01).

### 3.4 Chưa chốt — truy cập dữ liệu riêng tư khi xử lý khiếu nại (PO-01)

- Câu hỏi: Admin có được **xem** chi tiết hợp đồng/hóa đơn riêng tư để xử lý khiếu nại không?
- **Mặc định thiết kế: KHÔNG truy cập.**
- **Không** thiết kế cơ chế đặc quyền hỗ trợ (impersonation, support access, break-glass…) cho tới khi Product Owner phê duyệt chính sách: phạm vi, sự đồng ý của chủ trọ/người thuê, thời hạn, audit.
- Trong thời gian chờ, khiếu nại về tài chính được xử lý bằng thông tin các bên tự cung cấp.

## 4. Tenant (người thuê)

- Chỉ truy cập sau khi liên kết đã xác minh và còn hiệu lực. Bị thu hồi liên kết thì mất quyền ngay.
- **Không được:**
  - sửa hóa đơn, chỉ số, đơn giá;
  - tự xác nhận thanh toán (chỉ gửi chứng từ → `PENDING`);
  - xem dữ liệu phòng/người thuê khác.
- Thành viên ở chung có tài khoản liên kết: phạm vi xem hóa đơn/cọc của hợp đồng chung **cần chốt**. Đề xuất: được xem hóa đơn, chỉ người đứng tên xem cọc.

## 5. Kiểm thử phân quyền bắt buộc

Bổ sung cho ACL-001..003 của BRD:

| ID | Kịch bản | Kỳ vọng |
|---|---|---|
| ACL-ADM-01 | ADMIN gọi API sửa rate / meter / invoice / payment / contract / deposit của workspace | 403 |
| ACL-ADM-02 | ADMIN gỡ listing | Listing ẩn; room, contract, invoice không đổi; có audit |
| ACL-ADM-03 | ADMIN đọc chi tiết invoice/contract của workspace | 403 (theo mặc định PO-01) |
| ACL-TEN-01 | Tenant gọi xác nhận payment của mình | 403 |
| ACL-TEN-02 | Tenant đọc invoice của hợp đồng khác | 403 hoặc 404 |
| ACL-WS-01 | OWNER workspace A truy cập tài nguyên workspace B | 403 hoặc 404 |
