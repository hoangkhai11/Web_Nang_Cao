# Rental Platform V1.0 — Bổ sung đặc tả nghiệp vụ

> **Loại tài liệu:** Addendum (phần bổ sung) cho `Rental_Platform_BRD_SRS_V1.0.docx`. Không thay thế BRD/SRS.
> **Cập nhật:** 14/10/2026.
> **Thứ tự ưu tiên khi mâu thuẫn:**
> 1. Quyết định đã chốt của chủ dự án ghi trong tài liệu này.
> 2. BRD/SRS `.docx`.
> 3. Các spec khác.
>
> Mọi mâu thuẫn còn treo được liệt kê ở [Mục 9](#9-mâu-thuẫn-tài-liệu-đã-phát-hiện).

## Quy ước trạng thái

| Nhãn | Ý nghĩa |
|---|---|
| **DESIGN APPROVED** | Đã có trong BRD/SRS hoặc đã được chủ dự án chốt, được phép thiết kế/triển khai theo roadmap |
| **PROPOSED** | Đề xuất, chưa được Product Owner phê duyệt. Không triển khai khi chưa duyệt |
| **IMPLEMENTED** | Đã có code + test được xác minh. Tài liệu này **không** ghi nhận trạng thái IMPLEMENTED cho backend. Frontend demo bằng mock không được tính là IMPLEMENTED |

Tài liệu liên quan:
- [ROLE_PERMISSIONS.md](ROLE_PERMISSIONS.md): phân quyền theo vai trò, quyết định về Admin.
- [MARKETPLACE_SEARCH_SPEC.md](MARKETPLACE_SEARCH_SPEC.md): tìm phòng theo giá / khoảng cách / đánh giá, Trợ lý tìm trọ thông minh, đánh giá trọ.

---

## 1. Mô hình sản phẩm — bốn không gian (DESIGN APPROVED)

| # | Không gian | Người dùng | Mục đích |
|---|---|---|---|
| 1 | **Public Marketplace** | Khách vãng lai, USER | Tìm phòng, xem tin công khai, bản đồ, đặt lịch xem |
| 2 | **Landlord Workspace** | OWNER / MANAGER / STAFF của một workspace | Quản lý nhà trọ: tòa/khu, phòng, người thuê, hợp đồng, xe, điện nước, hóa đơn, thanh toán, cọc, bảo trì, thống kê |
| 3 | **Tenant Portal** | USER đã liên kết hợp lệ với hồ sơ Tenant | Xem phòng, hợp đồng, hóa đơn, thanh toán, cọc; gửi bảo trì |
| 4 | **Platform Admin** | ADMIN | Vận hành nền tảng: tài khoản, kiểm duyệt tin, khiếu nại, thống kê tổng hợp, cấu hình chung |

### 1.1 Nguyên tắc vai trò

- **Một tài khoản, nhiều vai trò theo ngữ cảnh.** Cùng một User có thể đồng thời:
  - tìm phòng trên Marketplace,
  - là OWNER của workspace A và STAFF của workspace B,
  - là người thuê đã liên kết ở một hợp đồng khác.
- **Không có global role `LANDLORD`** trong bảng `users`. Global role chỉ gồm `USER` và `ADMIN`.
- **Quyền quản lý nhà trọ** đến từ `workspace_memberships` (OWNER / MANAGER / STAFF) và chỉ có hiệu lực trong workspace đó.
- **Quyền truy cập dữ liệu thuê riêng** đến từ `tenant_user_links` đã xác minh và đang hiệu lực. Chưa liên kết hợp lệ thì không truy cập được Tenant Portal.
- **Quy mô:** một chủ trọ có thể quản lý nhiều tòa/khu trọ và nhiều phòng (ví dụ 30 phòng hoặc hơn). Thiết kế không được giả định giới hạn 1 tòa hay ≤ 30 phòng. Xem mâu thuẫn M-03.

---

## 2. Landlord Workspace

### 2.1 Quản lý nhà trọ và phòng (DESIGN APPROVED — FR-PROP-01..04, BR-12)

- Một workspace có **nhiều tòa/khu trọ**. Mỗi tòa có nhiều phòng; mã phòng duy nhất trong tòa.
- Thêm/sửa phòng: giá thuê niêm yết, diện tích, sức chứa, mô tả, tiện ích, hình ảnh (nhiều ảnh, ảnh bìa, thứ tự).
- **Trạng thái vận hành** tách biệt với **trạng thái đăng tin**:

| Trạng thái vận hành | Ý nghĩa |
|---|---|
| Trống | Sẵn sàng cho thuê |
| Đang thuê | Có hợp đồng ACTIVE. Trạng thái này nên được suy ra từ hợp đồng, không chỉ nhập tay |
| Không khả dụng | Đang sửa chữa, giữ chỗ, ngừng khai thác |

- **Đăng phòng lên Marketplace** chỉ khi đủ điều kiện:
  - tòa đã xuất bản,
  - phòng đã xuất bản,
  - còn khả năng cho thuê.

  Chính sách đăng phòng "sắp trống" vẫn mở (OD-03).

### 2.2 Quản lý người thuê và hợp đồng (DESIGN APPROVED — FR-TEN, FR-CON, BR-01..05)

- Chủ trọ tạo hồ sơ Tenant **không cần** tài khoản User. Thông tin cơ bản; CCCD chỉ lưu khi thực sự cần, và phải mã hóa và phân quyền xem.
- Quản lý **thành viên đang ở** (ContractMember) có ngày vào/ngày ra. Không xóa lịch sử cư trú.
- **Liên kết tài khoản người thuê**: chỉ sau khi xác minh (mã mời / xác minh). **Không tự liên kết** khi trùng số điện thoại. Có cơ chế thu hồi.
- **Hợp đồng:**
  - Ngày bắt đầu và ngày kết thúc bắt buộc; ngày kết thúc tính bao gồm.
  - Không có 2 hợp đồng ACTIVE chồng lấn thời gian trên cùng phòng.
  - Đi theo state machine của BRD.
- **Số người ở theo từng phòng/thời điểm** được truy ra từ ContractMember. Dùng cho:
  - nước theo đầu người (snapshot ngày cuối kỳ, BR-05),
  - giới hạn sức chứa.

### 2.3 Quản lý xe (DESIGN APPROVED — FR-VEH-01; một phần PROPOSED)

- **DESIGN APPROVED:**
  - Xe gắn với **thành viên hợp đồng**: loại xe, biển số (nếu có), ngày bắt đầu/kết thúc.
  - Phí gửi xe tính theo `BuildingRate` (FR-RATE-01).
- Theo dõi **số lượng xe hiện có** theo phòng, hợp đồng và tòa.
- **PROPOSED — sức chứa bãi xe:**
  - Thêm cấu hình *số chỗ đỗ tối đa theo loại xe* cho từng tòa.
  - Từ đó tính *số chỗ còn trống* = sức chứa − số xe đang hiệu lực.
- Phải phân biệt hai khái niệm:
  - "Số xe hiện có" là dữ liệu vận hành, đã có.
  - "Nhà trọ còn chỗ đỗ cho người thuê mới" cần thêm dữ liệu sức chứa, chưa có trong data model 26 bảng.

  Nếu được duyệt, có thể hiển thị công khai dạng "Còn chỗ để xe máy" trên Marketplace. Không công khai biển số hay chủ xe.

### 2.4 Điện, nước, dịch vụ (DESIGN APPROVED — FR-RATE-01, FR-METER-01, BR-05, BR-06)

| Khoản | Cách tính được hỗ trợ | Ghi chú |
|---|---|---|
| Điện | Theo chỉ số công tơ: (mới − cũ) × đơn giá/kWh | currentValue ≥ previousValue |
| Nước | `BY_METER`: theo đồng hồ (m³ × đơn giá) **hoặc** `PER_PERSON`: số người cư trú ngày cuối kỳ × đơn giá/người | Không bắt nhập đồng hồ nước khi `PER_PERSON` |
| Internet / Wifi | Khoản cố định theo phòng / kỳ | Theo BuildingRate |
| Rác, vệ sinh | Khoản cố định theo phòng / kỳ | Theo BuildingRate |
| Gửi xe | Theo xe đang hiệu lực trong kỳ (theo loại xe) | Quy tắc tính phí xe theo kỳ còn mở (OD-05) |
| Khoản khác | Khoản bổ sung trên hóa đơn (adjustment / item bổ sung) | Có audit |

- **Đơn vị tính phí** đang hỗ trợ:
  - theo phòng: Internet, rác, vệ sinh;
  - theo người: nước PER_PERSON;
  - theo chỉ số: điện, nước BY_METER;
  - theo xe: gửi xe.
- **PROPOSED:** cho chủ trọ tự cấu hình khoản phí tùy biến với đơn vị (phòng / người / xe / cố định). Việc này vượt ngoài các cột cố định của `building_rates` hiện tại nên cần PO duyệt và thiết kế lại DB.
- **Giữ nguyên các quy tắc đã chốt:**
  - Rates có phiên bản theo `effectiveFrom`.
  - Hóa đơn ISSUED là snapshot, không đổi theo bảng giá mới.
  - Mọi điều chỉnh đều có audit.

### 2.5 Hóa đơn và thanh toán (DESIGN APPROVED — FR-BILL, FR-PAY, BR-07..10)

- Tạo/xem hóa đơn tháng: mỗi hợp đồng tối đa 1 hóa đơn tháng thường mỗi kỳ. Tháng lẻ tính prorate theo ngày.
- Chi tiết hóa đơn gồm các dòng: tiền phòng, điện, nước, xe, dịch vụ, khoản bổ sung.
- Theo dõi tổng phải thu, đã thanh toán, còn nợ. Hỗ trợ **thanh toán một phần**.
- **Xác nhận thanh toán thủ công** do chủ trọ/người được ủy quyền thực hiện. Chỉ Payment `CONFIRMED` mới làm giảm công nợ.
- **Tiền cọc** theo dõi riêng (thu / hoàn / khấu trừ), không tính là doanh thu tiền thuê.

### 2.6 Thống kê chủ trọ (DESIGN APPROVED — FR-ADMIN-02, FR-ADMIN-03)

| Chỉ số | Nguồn dữ liệu |
|---|---|
| Tổng số phòng, phòng trống, phòng đang thuê | rooms + contracts ACTIVE |
| Tỷ lệ lấp đầy | phòng có hợp đồng ACTIVE / tổng phòng khai thác |
| Doanh thu **đã xác nhận** theo tháng | payments `CONFIRMED`, không gồm cọc |
| Công nợ chưa thanh toán | Σ(tổng hóa đơn sau điều chỉnh − đã thu CONFIRMED) |
| Hợp đồng sắp hết hạn | contracts ACTIVE có endDate trong N ngày tới (N đề xuất 30, **cần chốt**) |
| Tình trạng bảo trì | maintenance_requests theo OPEN / IN_PROGRESS / RESOLVED |

Số liệu chỉ tính từ dữ liệu thật trong workspace. **Không đưa số liệu giả định hay demo thành dữ liệu thật.** Số liệu trong ảnh UI demo và mock frontend chỉ là minh họa.

---

## 3. Tenant Portal (DESIGN APPROVED — FR-TPORT-01, FR-PAY-01, FR-OPS-01)

Chỉ dành cho USER **đã liên kết hợp lệ** với hồ sơ Tenant. Liên kết phải đã xác minh, đang hiệu lực, và chưa bị thu hồi.

**Người thuê được:**
- Xem thông tin phòng đang thuê.
- Xem hợp đồng, thời hạn, thành viên ở chung.
- Xem hóa đơn hiện tại và lịch sử hóa đơn, kèm chi tiết tiền phòng, điện, nước, xe, dịch vụ.
- Theo dõi các khoản đã thanh toán (CONFIRMED), đang chờ xác nhận và số còn nợ.
- Gửi thông tin/chứng từ thanh toán (chuyển khoản) để chủ trọ xác nhận. Payment ở trạng thái `PENDING` cho tới khi được xác nhận.
- Xem thông tin tiền cọc của hợp đồng mình (số tiền và các giao dịch thu/hoàn/khấu trừ).
- Gửi yêu cầu sửa chữa/bảo trì và theo dõi trạng thái.
- Nhận thông báo về hóa đơn, thanh toán, hợp đồng, bảo trì. Kênh trong app; kênh ngoài (email/SMS/Zalo) chưa chốt.

**Người thuê không được:**
- Sửa hóa đơn, chỉ số điện nước hoặc đơn giá.
- Tự xác nhận đã thanh toán.
- Xem dữ liệu của phòng hoặc người thuê khác nếu không có quyền hợp lệ.

---

## 4. Public Marketplace (DESIGN APPROVED — FR-MKT-01, FR-MKT-02, FR-VIEW-01..03; phần mở rộng PROPOSED)

| Chức năng | Trạng thái |
|---|---|
| Tìm phòng theo khu vực, khoảng giá, diện tích, sức chứa; phân trang | DESIGN APPROVED (FR-MKT-01) |
| Lọc theo tiện ích, tình trạng còn trống | PROPOSED: BRD chỉ nêu khu vực/giá/diện tích/sức chứa; bảng `amenities` đã có trong data model |
| Xem ảnh, mô tả, giá và **các khoản phí được công khai** | DESIGN APPROVED (FR-PROP-03); danh sách phí công khai cần chốt |
| Xem vị trí phòng trên bản đồ, đồng bộ với kết quả | DESIGN APPROVED (FR-MKT-02); map provider còn mở (OD-04) |
| Khoảng cách từ phòng đến địa điểm do người dùng chọn (VD: Đại học Bách khoa Hà Nội) | PROPOSED |
| Quãng đường và thời gian di chuyển theo phương tiện được hỗ trợ | PROPOSED, phụ thuộc nhà cung cấp routing |
| Lọc/sắp xếp theo khoảng cách | PROPOSED |
| Đánh giá trọ (sao + nhận xét) và lọc/sắp xếp theo đánh giá | PROPOSED: tính năng mới, cần bảng dữ liệu mới |
| Trợ lý tìm trọ thông minh (P04-B) | **PRODUCT FEATURE PROPOSAL — CHƯA TRIỂN KHAI; CHƯA CHỐT TOÀN BỘ CHI TIẾT** |
| Đặt lịch xem phòng | DESIGN APPROVED (FR-VIEW-01) |
| Chỉ hiển thị listing đủ điều kiện công khai | DESIGN APPROVED (BR-12) |

Đặc tả chi tiết giao diện và logic: [MARKETPLACE_SEARCH_SPEC.md](MARKETPLACE_SEARCH_SPEC.md).

**Dữ liệu không bao giờ công khai trên Marketplace:**
- hợp đồng, hóa đơn, thanh toán, chỉ số điện nước;
- danh tính, số điện thoại, xe của người thuê hiện tại;
- số điện thoại đầy đủ của chủ trọ trước khi lịch xem được xác nhận (đề xuất, cần chốt).

---

## 5. Platform Admin

Đã chốt: **Admin không được tự ý sửa dữ liệu tài chính và nghiệp vụ riêng của chủ trọ.** Chi tiết quyền được / không được ở [ROLE_PERMISSIONS.md](ROLE_PERMISSIONS.md#3-platform-admin--quyết-định-đã-chốt).

---

## 6. Business rules giữ nguyên

Không thay đổi các quy tắc đã chốt trong BRD/SRS:
- BR-01..BR-12: Tenant độc lập User, ngày hợp đồng, không chồng lấn ACTIVE, cư trú có ngày vào/ra, snapshot nước theo người, rates theo phiên bản, 1 hóa đơn tháng thường mỗi hợp đồng mỗi kỳ, prorate, chỉ CONFIRMED tác động công nợ, không xóa cứng dữ liệu tài chính, cô lập workspace, điều kiện xuất bản.
- Các state machine của Contract, ViewingRequest, Invoice, Payment.

### Business rules bổ sung (PROPOSED — chờ duyệt)

| ID đề xuất | Quy tắc |
|---|---|
| BR-P01 | Gỡ / ẩn LISTING công khai **không** xóa hay sửa ROOM, CONTRACT, INVOICE, PAYMENT gốc |
| BR-P02 | Chỉ người thuê có hợp đồng hợp lệ (ACTIVE hoặc đã kết thúc trong khoảng thời gian quy định) với phòng/tòa mới được đánh giá. Mỗi hợp đồng tối đa 1 đánh giá. Xem MARKETPLACE_SEARCH_SPEC §5 |
| BR-P03 | Thứ hạng tìm kiếm không được tăng ngầm vì tin tài trợ. Nếu có quảng cáo phải gắn nhãn "Tài trợ" tách biệt |
| BR-P04 | Không khẳng định một phòng đạt giới hạn thời gian di chuyển khi không tính được tuyến đường |

---

## 7. Quyết định đã chốt trong lần cập nhật này

| Mã | Quyết định | Nguồn |
|---|---|---|
| D-01 | Bốn không gian sản phẩm: Marketplace, Landlord Workspace, Tenant Portal, Platform Admin | Chủ dự án |
| D-02 | Không tạo global role `LANDLORD`; quyền quản lý theo workspace membership | Chủ dự án (đã có ở FR-AUTH-03) |
| D-03 | Admin **không** được sửa dữ liệu tài chính và nghiệp vụ riêng của chủ trọ | Chủ dự án |
| D-04 | Ẩn/gỡ listing là quyền kiểm duyệt; sửa/xóa room, contract, invoice, payment thuộc workspace | Chủ dự án |

## 8. Quyết định còn chờ Product Owner phê duyệt

| Mã | Nội dung | Mặc định tạm thời |
|---|---|---|
| PO-01 | Admin có được xem chi tiết hợp đồng/hóa đơn riêng tư để xử lý khiếu nại không | **Không truy cập.** Không thiết kế cơ chế đặc quyền hỗ trợ |
| PO-02 | Trợ lý tìm trọ thông minh (P04-B): phạm vi, có thuộc V1.0 không | PROPOSED, chưa triển khai |
| PO-03 | Trọng số xếp hạng (40/30/15/10/5) | Chỉ là đề xuất khởi điểm |
| PO-04 | Ngân sách mặc định hiểu là giá thuê riêng hay tổng chi phí dự kiến | Chưa chốt |
| PO-05 | Nhà cung cấp geocoding/routing; phương tiện được hỗ trợ (xe máy, ô tô, đi bộ, xe buýt…) | Chưa chọn (OD-04) |
| PO-06 | Tính năng đánh giá trọ: điều kiện được đánh giá, tiêu chí, kiểm duyệt, ngưỡng hiển thị | PROPOSED |
| PO-07 | Có tính điểm đánh giá vào xếp hạng tìm kiếm / Trợ lý thông minh hay không | **Không**, chỉ dùng để lọc/sắp xếp khi người dùng chọn |
| PO-08 | Sức chứa bãi xe và hiển thị "còn chỗ để xe" | PROPOSED |
| PO-09 | Khoản phí tùy biến (đơn vị phòng/người/xe/cố định) | PROPOSED |
| PO-10 | Ngưỡng "hợp đồng sắp hết hạn" (N ngày) | Đề xuất 30 ngày |
| PO-11 | Các khoản phí nào được công khai trên tin đăng | Chưa chốt |
| PO-12 | Có thay đổi số lượng "21 tính năng V1.0" khi bổ sung các đề xuất trên không | Không tự sửa con số này |

Các Open Decisions OD-01..OD-09 trong BRD/SRS vẫn giữ nguyên.

## 9. Mâu thuẫn tài liệu đã phát hiện

| Mã | Mâu thuẫn | Xử lý đề xuất |
|---|---|---|
| M-01 | BRD §1.1 liệt kê vai trò "LANDLORD / OWNER" trong khi FR-AUTH-03 và quyết định D-02 chỉ có global role USER/ADMIN | Hiểu "LANDLORD" là tên gọi nghiệp vụ của OWNER trong workspace, **không** phải global role. Cần sửa câu chữ trong BRD `.docx` ở lần cập nhật sau |
| M-02 | BRD §4–5 ghi **TypeORM**. Theo task, source backend có thể dùng **Prisma 7.10**. Repo này không chứa source backend, `CURRENT_STATUS.md` hay `package.json` backend nên **không xác minh được** | Ghi nhận; đối chiếu `CURRENT_STATUS.md` của monorepo trước khi chốt. Không sửa source/package |
| M-03 | BRD ghi phạm vi "chủ trọ nhỏ (5–30 phòng)"; yêu cầu mới: "30 phòng hoặc hơn", nhiều tòa/khu | Không đặt giới hạn cứng trong thiết kế; con số 5–30 chỉ là phân khúc mục tiêu |
| M-04 | Roadmap trong BRD dùng **Sprint S0–S8** (Marketplace = S3); yêu cầu mới tham chiếu **P00–P13** và **P04** cho Marketplace. Repo này không có `MASTER_ROADMAP.md` | Đề xuất P04-A/B/C ghi tương đối theo "giai đoạn Marketplace". Ánh xạ S3 ↔ P04 cần xác nhận |
| M-05 | Contract state machine BRD: `DRAFT → ACTIVE → ENDED`, `DRAFT → CANCELLED`. Frontend demo dùng thêm `TERMINATED` (chấm dứt sớm) và không có `CANCELLED` | Frontend phải theo BRD khi tích hợp. "Chấm dứt sớm" = ACTIVE → ENDED với endDate sớm hơn, trừ khi PO duyệt thêm trạng thái |
| M-06 | Invoice BRD: `DRAFT/ISSUED/VOID`. Frontend demo hiển thị `PARTIALLY_PAID/PAID/OVERDUE` | Đây là trạng thái **thanh toán suy ra** để hiển thị, không phải trạng thái lưu của Invoice. Cần ghi rõ trong API contract |
| M-07 | Payment BRD có `CANCELLED`; frontend demo chưa có | Bổ sung khi tích hợp |
| M-08 | FR-ADMIN-01 ghi Admin "quản lý tài khoản, **nội dung** và thống kê", phạm vi rộng | Đã giới hạn bằng D-03/D-04 và ROLE_PERMISSIONS.md |
| M-09 | Các file `AGENTS.md`, `PROJECT_CONTEXT.md`, `docs/CURRENT_STATUS.md`, `docs/MASTER_ROADMAP.md`, `docs/DATABASE_DESIGN.md`, `docs/API_CONTRACT.md` **không tồn tại** trong repo này | Khi ghép vào monorepo, cần hợp nhất nội dung tài liệu này vào các file đó, tránh trùng lặp |
| M-10 | NFR-02 và spec frontend: BRD đặt "mục tiêu ~60 FPS", spec frontend ghi "không hứa 60 FPS mọi thiết bị" | Không mâu thuẫn bản chất: là mục tiêu, phải đo trên thiết bị tham chiếu (OD-08) |
