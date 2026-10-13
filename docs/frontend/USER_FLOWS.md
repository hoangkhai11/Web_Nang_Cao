# Luồng người dùng (demo bằng mock)

## F1 — Khách tìm phòng & đặt lịch xem

```mermaid
flowchart LR
  A[/ Trang chủ /] -->|Khu vực, giá, loại phòng| B[/rooms — lọc, sắp xếp, bản đồ/]
  B --> C[/rooms/:id — chi tiết/]
  C --> D[/rooms/:id/viewing — chọn ngày, khung giờ, liên hệ/]
  D -->|Gửi| E{{Viewing PENDING}}
  E --> F[/my-viewings — theo dõi/]
  E -.phòng thuộc workspace.-> G[/w/:ws/viewings — chủ trọ xác nhận/]
```

Thử nhanh: `/` → "Tìm ngay" → "Xem chi tiết" → "Đặt lịch xem phòng" → chọn 14:00 → gửi.

## F2 — Chủ trọ dựng workspace & đăng tin

```mermaid
flowchart LR
  L[/login quan@demo.vn/] --> S[/workspaces/select/]
  S --> D[/w/ws-an-nhien/dashboard/]
  D --> B1[/buildings/new/] --> B2[/buildings/:id/]
  B2 -->|Thêm phòng| R1[/rooms/new?buildingId=/]
  R1 -->|Trạng thái đăng tin = Đang đăng| R2[/rooms/:id/]
  R2 -->|Trống + Đang đăng| M[(Hiển thị ở /rooms)]
```

## F3 — Tạo người thuê → hợp đồng → phòng đang thuê

```mermaid
sequenceDiagram
  participant O as Chủ trọ
  participant UI as Frontend
  participant API as Mock API
  O->>UI: /tenants/new (không tự liên kết theo SĐT)
  UI->>API: POST tenants
  O->>UI: /contracts/new (start/end bắt buộc)
  UI-->>O: Cảnh báo nếu trùng hợp đồng ACTIVE
  UI->>API: POST contracts (DRAFT)
  O->>UI: Kích hoạt
  UI->>API: POST contracts/:id/activate
  API-->>UI: 409 nếu trùng · OK → ACTIVE, phòng OCCUPIED, ghi nhận cọc
```

## F4 — Đơn giá → điện nước → hóa đơn → thanh toán một phần

```mermaid
flowchart LR
  R[/rates — phiên bản effectiveFrom/] --> M[/meters — ghi số cũ/mới/]
  M --> P[/billing/run — xem trước/]
  P -->|READY / MISSING_METER / ALREADY_ISSUED| I[Phát hành — snapshot đơn giá]
  I --> INV[/invoices/:id/]
  INV --> PAY[/payments — thu 1 phần/]
  PAY -->|chỉ khoản CONFIRMED| PAID[(Đã thu)]
```

Demo: kỳ hiện tại có 3 hợp đồng chưa lập hóa đơn (2 phòng thiếu chỉ số C.401/C.402 → ghi ở `/meters` rồi lập lại).

## F5 — Người thuê

```mermaid
flowchart LR
  U[User đăng nhập] --> L[/tenant/link-account — mã mời + mã HĐ + SĐT + OTP/]
  L --> P{{PENDING}} --> A[Chủ trọ duyệt ở /w/:ws/tenants/:id]
  A --> T[/tenant — tổng quan/]
  T --> I[/tenant/invoices/:id/]
  I --> S[/tenant/payments/new — minh chứng/]
  S --> W{{Chờ chủ trọ xác nhận}} --> C[/w/:ws/payments — xác nhận/]
```

Tài khoản `nam@demo.vn` đã liên kết sẵn. Với `minh@demo.vn`: có yêu cầu PENDING; chủ trọ duyệt tại hồ sơ người thuê có nhãn "Chờ duyệt liên kết".

## F6 — Admin

```mermaid
flowchart LR
  A[/login admin@demo.vn/] --> D[/admin/]
  D --> W[/admin/workspaces — ACTIVE ⇄ SUSPENDED/]
  D --> U[/admin/users — khóa/mở/]
  D --> L[/admin/listings — gỡ tin vi phạm/]
  W & U & L --> AL[/admin/audit-logs/]
```
