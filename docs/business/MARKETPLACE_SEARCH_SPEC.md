# Marketplace — Tìm trọ theo giá, khoảng cách, đánh giá & Trợ lý tìm trọ thông minh

> Addendum cho BRD/SRS V1.0 (FR-MKT-01, FR-MKT-02). Cập nhật 14/10/2026.
> Quy ước trạng thái: [BUSINESS_REQUIREMENTS.md](BUSINESS_REQUIREMENTS.md#quy-ước-trạng-thái).

| Phần | Trạng thái |
|---|---|
| §1 Tìm theo giá, khu vực, diện tích, sức chứa | **DESIGN APPROVED** (FR-MKT-01) |
| §1 Lọc tiện ích, tình trạng | **PROPOSED** |
| §2 Tìm / lọc / sắp xếp theo **khoảng cách** đến địa điểm | **PROPOSED** |
| §3 **Đánh giá trọ** và lọc/sắp xếp theo đánh giá | **PROPOSED**, tính năng mới, cần bảng dữ liệu mới |
| §4 **Trợ lý tìm trọ thông minh** (P04-B) | **PRODUCT FEATURE PROPOSAL — CHƯA TRIỂN KHAI; CHƯA CHỐT TOÀN BỘ CHI TIẾT** |

Không phần nào trong tài liệu này được đánh dấu IMPLEMENTED. Frontend demo hiện có (`apps/web`, mock) mới có lọc giá/khu vực/diện tích/sức chứa/tiện ích và **bản đồ minh họa**. Frontend demo chưa có khoảng cách thật, đánh giá hay trợ lý thông minh.

---

## 1. Giao diện tìm phòng — tổng thể

### 1.1 Thanh tìm kiếm & bộ lọc (trang `/rooms`)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📍 Khu vực / địa điểm        💰 Giá thuê            🧭 Gần địa điểm   ⭐ Đánh giá │
│ [Bình Thạnh          ▾]   [2tr ●━━━━━━━● 5tr]   [ĐH Bách khoa ▾]   [Từ 4★ ▾]  │
│                              (ô nhập min/max)    bán kính [3 km ▾]               │
│                                                  hoặc ≤ [20 phút ▾] 🛵           │
│ Diện tích [≥20m² ▾]  Sức chứa [2+ ▾]  Tiện ích [Điều hòa ✕][Chỗ để xe ✕][+]      │
│ Sắp xếp: (Phù hợp nhất) (Giá thấp→cao) (Gần nhất) (Đánh giá cao) (Mới đăng)     │
│                                                [✨ Tìm trọ thông minh]   [Đặt lại]│
└─────────────────────────────────────────────────────────────────────────────────┘
```

- Mọi bộ lọc được đồng bộ lên **URL query**, để chia sẻ link và giữ trạng thái khi bấm back/forward.
- Trên mobile:
  - thanh lọc thu gọn thành nút **"Bộ lọc (n)"**, mở bottom-sheet;
  - các chip đang áp dụng hiển thị ngang, cuộn được, mỗi chip có nút ✕ để gỡ.
- Có nút **"Đặt lại"**. Khi không có kết quả, hiển thị gợi ý nới điều kiện (§1.5).

### 1.2 Lọc theo giá (DESIGN APPROVED)

| Thành phần | Hành vi |
|---|---|
| Thanh trượt 2 đầu + 2 ô nhập min/max | Bước 100.000 ₫; ô nhập định dạng `vi-VN` (VD `3.000.000`); min ≤ max, sai thì báo lỗi ngay dưới ô |
| Chip khoảng giá nhanh | "Dưới 2tr", "2–3tr", "3–5tr", "Trên 5tr" |
| Chế độ giá (PROPOSED, gắn với §4.6) | Radio **Giá thuê** / **Tổng chi phí ước tính**. Mặc định chưa chốt (PO-04) |
| Hiển thị trên thẻ phòng | Giá thuê `3.800.000 ₫/tháng`; nếu có ước tính thì thêm dòng phụ "≈ 4,5tr/tháng gồm điện nước, wifi, xe *(ước tính)*" |

### 1.3 Lọc / sắp xếp theo khoảng cách (PROPOSED)

**Luồng chọn địa điểm:**
1. Người dùng gõ tên địa điểm (VD "Đại học Bách khoa Hà Nội"). Ô nhập gợi ý từ dịch vụ place search; tối thiểu 3 ký tự, debounce 300ms.
2. Hoặc bấm **"Dùng vị trí hiện tại"**. Trình duyệt hỏi quyền; nếu bị từ chối thì báo nhẹ, không chặn tìm kiếm.
3. Người dùng chọn **một trong hai kiểu giới hạn**:
   - **Bán kính** (1 / 2 / 3 / 5 / 10 km), tính theo **đường thẳng**. Rẻ, không cần routing.
   - **Thời gian di chuyển tối đa** (10 / 15 / 20 / 30 phút) + **phương tiện**. Cần routing, nên chỉ hiển thị khi đã có nhà cung cấp hỗ trợ phương tiện đó (§4.5).

**Hiển thị trên thẻ phòng và bản đồ:**

```
┌──────────────┬──────────────────────────────────────────────────┐
│   [ảnh]      │ 3.800.000 ₫/tháng                ⭐ 4,6 (23)       │
│ Đã xác thực  │ Phòng Studio ban công – Bình Thạnh                 │
│              │ 📍 1,8 km đường thẳng · 🛵 ~12 phút (2,4 km đường đi)│
│              │ 25 m² · 2 người · Điều hòa · Chỗ để xe             │
│              │ [Xem chi tiết]  [Đặt lịch xem]                     │
└──────────────┴──────────────────────────────────────────────────┘
```

- Luôn ghi rõ **loại khoảng cách**:
  - "đường thẳng",
  - "đường đi",
  - thời gian "~ phút, ước tính" kèm biểu tượng phương tiện.
- Không tính được tuyến đường thì hiển thị "Chưa tính được thời gian di chuyển", **không** hiển thị con số.
- Bản đồ:
  - ghim địa điểm đích (icon khác);
  - vòng tròn bán kính (nếu lọc theo km);
  - ghim giá các phòng;
  - đường đi khi người dùng mở một phòng (nếu có routing).
- Sắp xếp **"Gần nhất"** chỉ khả dụng khi đã chọn địa điểm.

### 1.4 Lọc / sắp xếp theo đánh giá (PROPOSED — xem §3)

| Thành phần | Hành vi |
|---|---|
| Bộ lọc "Đánh giá" | Tất cả · Từ 3★ · Từ 4★ · Từ 4,5★ |
| Tùy chọn "Chỉ phòng có ≥ N đánh giá" | Tránh phòng chỉ có 1 đánh giá 5★ lên đầu (N mặc định 3, cần chốt) |
| Sắp xếp "Đánh giá cao" | Theo **điểm điều chỉnh** (§3.4), không theo trung bình thô |
| Hiển thị | `⭐ 4,6 (23 đánh giá)`; dưới ngưỡng thì "Chưa đủ đánh giá"; chưa có đánh giá thì "Chưa có đánh giá" (không hiển thị 0★) |

Phòng **chưa có đánh giá** không bị loại khi người dùng chưa chọn lọc theo sao.

### 1.5 Trạng thái giao diện bắt buộc

| Trạng thái | Nội dung |
|---|---|
| Đang tải | Skeleton thẻ phòng + bản đồ |
| Không có kết quả | "Không có phòng phù hợp" + **các nút nới điều kiện do người dùng chủ động bấm**: "Tăng ngân sách lên 3,5tr", "Mở rộng bán kính 5 km", "Bỏ lọc Từ 4★". Không tự âm thầm bỏ tiêu chí |
| Lỗi geocoding / routing | Vẫn hiển thị kết quả theo các bộ lọc khác. Banner: "Không tính được khoảng cách lúc này" |
| Thiếu tọa độ phòng | Phòng hiển thị "Chưa có vị trí chính xác", không tham gia lọc khoảng cách |
| Lỗi API | Thông báo lỗi + "Thử lại" |

### 1.6 Trang chi tiết phòng — bổ sung

- Khối **"Khoảng cách tới địa điểm của bạn"**: nhập/chọn địa điểm, hiển thị:
  - đường thẳng,
  - đường đi,
  - thời gian theo từng phương tiện được hỗ trợ.
- Khối **"Đánh giá"** (§3): điểm tổng, phân rã theo tiêu chí, danh sách nhận xét kèm phản hồi của chủ trọ, nút "Báo cáo đánh giá".
- Khối **"Chi phí ước tính/tháng"** (nếu bật §4.6), nêu rõ các giả định.

---

## 2. Khoảng cách — định nghĩa (PROPOSED)

| Khái niệm | Cách tính | Ghi chú |
|---|---|---|
| Khoảng cách đường thẳng | Haversine giữa tọa độ tòa nhà và địa điểm đích | Không cần dịch vụ ngoài; dùng cho lọc bán kính và lọc thô ứng viên |
| Khoảng cách theo đường đi | Từ dịch vụ routing | Phụ thuộc nhà cung cấp và phương tiện |
| Thời gian di chuyển dự kiến | Từ dịch vụ routing, theo phương tiện | Là **ước tính**; ghi rõ "~"; có thể phụ thuộc giờ cao điểm nếu nhà cung cấp hỗ trợ |

- Tọa độ lấy từ `buildings.latitude/longitude` (FR-PROP-01). Phòng thuộc tòa chưa có tọa độ không tham gia lọc khoảng cách.
- **Không tự khẳng định hỗ trợ routing xe máy.** Danh sách phương tiện hiển thị = danh sách nhà cung cấp đã chọn thực sự hỗ trợ (PO-05, OD-04).

---

## 3. Đánh giá trọ (PROPOSED — tính năng mới, chờ PO-06)

### 3.1 Ai được đánh giá

- Chỉ **người thuê đã liên kết hợp lệ** có hợp đồng với phòng đó ở trạng thái:
  - `ACTIVE` và đã ở tối thiểu X ngày (đề xuất 30), **hoặc**
  - `ENDED` trong vòng Y tháng (đề xuất 6).
- **Mỗi hợp đồng tối đa 1 đánh giá.** Được sửa trong Z ngày (đề xuất 14), sau đó khóa.
- Khách vãng lai, USER chưa từng thuê, chủ trọ/nhân viên workspace **không** được đánh giá.

### 3.2 Nội dung đánh giá

| Trường | Ràng buộc |
|---|---|
| Điểm tổng | 1–5★ (bắt buộc) |
| Điểm tiêu chí (tùy chọn) | Đúng mô tả · Chủ trọ/ quản lý · An ninh · Vệ sinh · Giá trị so với giá |
| Nhận xét | 20–1000 ký tự; lọc thông tin cá nhân (SĐT, CCCD) trước khi công khai |
| Ẩn danh | Hiển thị tên rút gọn (VD "Nam T.") + "Người thuê đã xác minh · ở 8 tháng" |

### 3.3 Quyền liên quan

- **Chủ trọ:** được **phản hồi công khai** 1 lần cho mỗi đánh giá. **Không được sửa/xóa/ẩn** đánh giá; được **báo cáo** đánh giá vi phạm.
- **Admin:** kiểm duyệt (ẩn/gỡ) đánh giá vi phạm chính sách. Đây là kiểm duyệt nội dung, không phải dữ liệu tài chính (ROLE_PERMISSIONS §3).
- **Không cho phép** đổi quà / giảm tiền lấy đánh giá; không dùng đánh giá để tăng thứ hạng tài trợ.

### 3.4 Điểm hiển thị & điểm sắp xếp

- **Điểm hiển thị** = trung bình điểm tổng, làm tròn 1 chữ số thập phân. Chỉ hiển thị khi số đánh giá ≥ N (đề xuất 3).
- **Điểm sắp xếp** = trung bình có điều chỉnh (Bayesian):

  `(C × m + Σ điểm) / (C + n)`

  trong đó:
  - `n` = số đánh giá của phòng/tòa,
  - `m` = điểm trung bình toàn nền tảng,
  - `C` = hằng số tin cậy (đề xuất 5).

  Mục đích: phòng ít đánh giá không vượt phòng nhiều đánh giá tốt.
- Đánh giá gắn với **phòng** và tổng hợp lên **tòa**. Việc hiển thị theo phòng hay theo tòa cần chốt; đề xuất hiển thị theo tòa vì phòng thay đổi người thuê.

### 3.5 Dữ liệu cần thêm (chưa có trong 26 bảng baseline — cần thiết kế DB & migration khi được duyệt)

- `room_reviews`:
  - `id`, `workspace_id`, `room_id`, `building_id`, `contract_id` (UNIQUE), `tenant_id`, `author_user_id`;
  - `rating` (1–5), các điểm tiêu chí, `comment`;
  - `status` (`PUBLISHED` / `HIDDEN` / `REMOVED`);
  - `created_at`, `edited_until`.
- `review_replies` (hoặc cột `landlord_reply` + `replied_at`).
- `review_reports`: báo cáo vi phạm.
- Bảng/khung nhìn tổng hợp điểm theo tòa/phòng để lọc/sắp xếp nhanh.

---

## 4. Trợ lý tìm trọ thông minh — Smart Rental Assistant

> **PRODUCT FEATURE PROPOSAL — CHƯA TRIỂN KHAI; CHƯA CHỐT TOÀN BỘ CHI TIẾT.**
> Đề xuất mở rộng giai đoạn Marketplace (P04), do chủ dự án yêu cầu đưa vào tài liệu nghiệp vụ để xem xét.

### 4.1 Mục tiêu

Giúp người tìm trọ tìm phòng phù hợp với:
- ngân sách;
- địa điểm học/làm;
- thời gian di chuyển và phương tiện;
- tiện ích bắt buộc.

V1.0 **không** dùng LLM hay machine learning. Dùng **lọc cứng + xếp hạng có thể giải thích**.

### 4.2 User story mẫu (dữ liệu ví dụ, không phải phòng thật)

> Là sinh viên, tôi muốn tìm phòng **≤ 3.000.000 ₫/tháng**, đi **xe máy ≤ 20 phút** tới **Đại học Bách khoa Hà Nội**, **bắt buộc có điều hòa và chỗ để xe**, để chọn nhanh các phòng phù hợp và biết vì sao chúng được đề xuất.

### 4.3 UX — luồng 8 bước

```
[✨ Tìm trọ thông minh]
 ① Bạn học / làm ở đâu?        [ Đại học Bách khoa Hà Nội        🔍 ]
 ② Ngân sách tối đa             [ 3.000.000 ₫ ]
 ③ Ngân sách là                 (•) Giá thuê phòng   ( ) Tổng chi phí ước tính
 ④ Đi bằng                      [🛵 Xe máy ▾]  tối đa [ 20 phút ▾]
    (chỉ liệt kê phương tiện mà nhà cung cấp routing hỗ trợ)
 ⑤ Tiện ích bắt buộc            [✓ Điều hòa] [✓ Chỗ để xe] [ WC riêng ] [ Máy giặt ] …
                                                        [ Xem phòng phù hợp → ]
```

Màn hình kết quả (⑥–⑧):

```
┌──────────── Danh sách xếp hạng ────────────┐┌──────────── Bản đồ ────────────┐
│ #1  2.800.000 ₫ · 92/100 phù hợp            ││  ★ ĐH Bách khoa                 │
│     🛵 ~11 phút (3,1 km đường đi)            ││    • 2,8tr  • 2,9tr  • 3,0tr    │
│     ✓ Rẻ hơn ngân sách 200.000 ₫            ││                                 │
│     ✓ Có điều hòa, chỗ để xe                ││                                 │
│     ⓘ Vì sao đề xuất?  [Chi tiết] [Đặt lịch]││                                 │
│ #2  …                                        │└─────────────────────────────────┘
└──────────────────────────────────────────────┘
```

- **"Vì sao đề xuất?"** mở bảng phân rã điểm, ví dụ:
  - Thời gian di chuyển 36/40,
  - Giá 27/30,
  - Thông tin đầy đủ 15/15,
  - Độ mới 9/10,
  - Tiện ích cộng thêm 5/5.

  Kèm các câu lý do dạng: "Đi 11 phút, nhanh hơn giới hạn 9 phút", "Rẻ hơn ngân sách 200.000 ₫", "Có thêm máy giặt riêng".
- **Không có kết quả:** hiển thị lý do loại phổ biến, ví dụ "12 phòng vượt ngân sách, 5 phòng thiếu chỗ để xe, 3 phòng không tính được thời gian di chuyển". Kèm nút nới **do người dùng chủ động bấm**:
  - "Tăng thời gian lên 25 phút",
  - "Tăng ngân sách lên 3,3tr",
  - "Bỏ 'Chỗ để xe' khỏi bắt buộc".

  **Không âm thầm bỏ tiêu chí bắt buộc.**
- Mobile: wizard từng bước, mỗi bước một màn; kết quả dạng danh sách + nút "Xem bản đồ".

### 4.4 Logic tìm kiếm

**Bước 1 — Hard filters (đều phải đạt):**
1. Listing hợp lệ và được phép công khai (BR-12), không bị Admin gỡ.
2. Phòng còn có thể cho thuê.
3. Giá nằm trong ngân sách theo chế độ đã chọn (giá thuê / tổng chi phí ước tính).
4. Đáp ứng **tất cả** tiện ích bắt buộc.
5. Thời gian di chuyển theo tuyến đường hợp lệ ≤ giới hạn.

   Nếu **không tính được** thời gian thì phòng **không** được coi là đạt tiêu chí này (BR-P04). Phòng đó có thể hiện ở nhóm riêng "Chưa xác định thời gian di chuyển" nếu người dùng bật hiển thị.

**Bước 2 — Ranking (thang 100). Trọng số khởi điểm ĐỀ XUẤT, chưa được PO phê duyệt (PO-03):**

| Thành phần | Trọng số | Cách tính đề xuất (phải từ dữ liệu thật) |
|---|---|---|
| Thời gian di chuyển | 40 | `40 × (1 − t / t_max)`, chặn trong [0, 40] |
| Giá so với ngân sách | 30 | `30 × (1 − giá / ngân_sách)` chuẩn hóa về [0, 30]; phòng sát ngân sách điểm thấp hơn |
| Mức độ đầy đủ thông tin | 15 | Có đủ ảnh (≥ N), mô tả, diện tích, tiện ích, phí công khai, tọa độ |
| Độ mới của tin đăng | 10 | Giảm dần theo số ngày từ lần cập nhật cuối |
| Tiện ích cộng thêm | 5 | Số tiện ích ngoài danh sách bắt buộc (có trần) |

- Điểm phải **giải thích được** và hiển thị phân rã.
- **Không dùng tin tài trợ để tăng điểm phù hợp.** Nếu sau này có quảng cáo, hiển thị khối/nhãn "Tài trợ" tách riêng (BR-P03).
- **Đánh giá trọ không nằm trong công thức** cho tới khi PO quyết định (PO-07).

### 4.5 Dữ liệu cần thiết

| Nhóm | Dữ liệu | Có trong baseline? |
|---|---|---|
| Phòng | giá, trạng thái, ảnh, diện tích, tiện ích | Có (rooms, room_images, room_amenities) |
| Tòa/khu | địa chỉ, tọa độ | Có (buildings) |
| Listing | trạng thái công khai, thời điểm cập nhật | Có một phần (listing_status). Cần xác nhận cột thời điểm cập nhật listing |
| Tiện ích | điều hòa, chỗ để xe, … | Có (amenities). "Chỗ để xe" là tiện ích khai báo; khác với sức chứa bãi xe thực tế (PO-08) |
| Dịch vụ | phí cố định/biến động để ước tính tổng chi phí | Có (building_rates) |
| Geocoding / place search | xác định địa điểm người dùng chọn | **Chưa**, cần nhà cung cấp (OD-04) |
| Routing | quãng đường, thời gian theo phương tiện | **Chưa**, cần nhà cung cấp; danh sách phương tiện hỗ trợ chưa xác định |

### 4.6 Tổng chi phí ước tính

```
Tổng ước tính/tháng = Giá thuê
                    + Điện  (giả định: E kWh/tháng × đơn giá)          ← giả định hiển thị rõ
                    + Nước  (PER_PERSON: số người dự kiến × đơn giá | BY_METER: giả định m³)
                    + Internet + Rác/vệ sinh (cố định)
                    + Gửi xe (số xe người dùng khai báo × phí theo loại)
```

- Giả định E và m³ lấy từ **tham số mặc định công khai** do nền tảng cấu hình (VD 80 kWh, 4 m³/người), người dùng có thể chỉnh.
- **Không** dùng dữ liệu tiêu thụ thực tế của người thuê khác để tính công khai.
- Luôn ghi nhãn "*ước tính*" và liệt kê giả định.
- **Quyết định còn mở (PO-04):** mặc định ngân sách (VD 3 triệu) là giá thuê riêng hay tổng chi phí ước tính.

### 4.7 API dự kiến — API DESIGN PROPOSAL (chưa duyệt, chưa triển khai)

`POST /api/v1/listings/recommendations`

```jsonc
// Request (đề xuất)
{
  "destination": { "placeId": "…", "lat": 21.0050, "lng": 105.8430 },  // một trong hai
  "maxBudget": 3000000,
  "budgetMode": "RENT_ONLY",            // RENT_ONLY | ESTIMATED_TOTAL
  "travelMode": "MOTORBIKE",            // chỉ các mode nhà cung cấp hỗ trợ
  "maxTravelMinutes": 20,
  "requiredAmenities": ["AIR_CON", "PARKING"],
  "assumptions": { "occupants": 1, "vehicles": 1 },   // khi ESTIMATED_TOTAL
  "page": 1, "pageSize": 10
}

// Response (đề xuất)
{
  "items": [{
    "listingId": "…", "roomId": "…", "title": "…", "price": 2800000,
    "estimatedTotal": null,
    "location": { "lat": 0, "lng": 0 },
    "straightLineMeters": 2100,
    "route": { "status": "OK", "distanceMeters": 3100, "durationMinutes": 11 },  // status: OK | UNAVAILABLE
    "matchScore": 92,
    "scoreBreakdown": { "travel": 36, "price": 27, "completeness": 15, "freshness": 9, "extraAmenities": 5 },
    "reasons": ["Đi ~11 phút bằng xe máy", "Có điều hòa, chỗ để xe"],
    "missingData": []
  }],
  "excludedSummary": { "overBudget": 12, "missingAmenities": 5, "routeUnavailable": 3 },
  "page": 1, "pageSize": 10, "total": 7
}
```

Mở rộng `GET /api/v1/marketplace/rooms` (PROPOSED) cho tìm thường:
- `nearLat`, `nearLng`, `radiusKm`;
- `minRating`, `minReviewCount`;
- `sort=distance|rating|price_asc|newest|relevant`.

### 4.8 Hiệu năng, chi phí, quyền riêng tư

- Lọc ứng viên bằng hard filters + **bán kính đường thẳng** trước, rồi mới gọi routing cho tập nhỏ (đề xuất tối đa 50 ứng viên mỗi request).
- **Không** tính tuyến đường cho hàng nghìn phòng mỗi request. Ưu tiên API ma trận khoảng cách theo lô.
- Cache kết quả routing theo (tòa, điểm đích làm tròn, phương tiện) với TTL phù hợp.
- Kiểm soát quota và chi phí dịch vụ bản đồ; rate-limit endpoint gợi ý.
- Fallback rõ ràng khi geocoding/routing lỗi: trả `route.status = UNAVAILABLE`, UI hiển thị trung thực.
- **Không lưu lịch sử vị trí / địa điểm tìm kiếm** gắn với người dùng khi chưa có nhu cầu và chính sách rõ ràng. Log chỉ ở mức tổng hợp, không chứa tọa độ chính xác.

### 4.9 Vị trí trong roadmap (đề xuất, chưa đánh dấu triển khai)

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| **P04-A** | Search/filter/listing/map cơ bản (FR-MKT-01/02) + lọc tiện ích, khoảng cách đường thẳng | Phần FR-MKT: DESIGN APPROVED; phần mở rộng: PROPOSED |
| **P04-B** | Smart rental recommendations (§4) | PROPOSED |
| **P04-C** | Kiểm thử ranking, routing, dữ liệu thiếu, hiệu năng | PROPOSED |
| (riêng) | Đánh giá trọ (§3): cần thiết kế DB, nên xếp sau khi Tenant Portal ổn định | PROPOSED; vị trí roadmap cần PO quyết |

- P04 tương ứng "Sprint S3 Marketplace" trong BRD. Ánh xạ cần xác nhận (mâu thuẫn M-04).
- Không đổi thứ tự P00–P13, không tạo sprint mới.

**Có thể hoãn** (ngoài phạm vi đề xuất hiện tại):
- lưu bộ lọc tìm trọ;
- thông báo khi có phòng phù hợp mới;
- cá nhân hóa theo lịch sử;
- chatbot AI.

---

## 5. Gợi ý kiểm thử (khi được duyệt)

| ID | Kịch bản |
|---|---|
| SRCH-01 | Lọc giá min > max bị báo lỗi; min = max hợp lệ |
| SRCH-02 | Lọc bán kính 3 km chỉ trả phòng có tọa độ trong bán kính (Haversine) |
| SRCH-03 | Phòng thiếu tọa độ không xuất hiện khi lọc khoảng cách, vẫn xuất hiện khi không lọc |
| SRCH-04 | Sắp xếp "Đánh giá cao" dùng điểm Bayesian; phòng 1 đánh giá 5★ không vượt phòng 40 đánh giá 4,7★ |
| REC-01 | Phòng thiếu 1 tiện ích bắt buộc bị loại dù điểm cao |
| REC-02 | Routing lỗi thì phòng không được tính là đạt giới hạn thời gian; UI báo "Chưa tính được" |
| REC-03 | Không kết quả: hiển thị `excludedSummary` + nút nới điều kiện; không tự bỏ tiêu chí |
| REC-04 | Tổng điểm = tổng phân rã; điểm tái lập được với cùng dữ liệu |
| REC-05 | Tin tài trợ (nếu có) không làm thay đổi `matchScore` |
| REV-01 | User không có hợp đồng hợp lệ không gửi được đánh giá (403) |
| REV-02 | Một hợp đồng gửi đánh giá lần 2 bị từ chối (409) |
| REV-03 | Chủ trọ không sửa/xóa được đánh giá; chỉ phản hồi và báo cáo |
| PERF-01 | Một request gợi ý gọi routing ≤ giới hạn ứng viên; lần 2 dùng cache |
