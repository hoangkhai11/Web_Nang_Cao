-- ============================================================
-- CSDL: TIM PHONG TRO
-- Website tim & dang tin cho thue phong tro (dang classifieds)
-- Cu phap: MySQL / MariaDB
-- ============================================================

DROP DATABASE IF EXISTS tim_phong_tro;
CREATE DATABASE tim_phong_tro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tim_phong_tro;

-- ------------------------------------------------------------
-- Bang NguoiDung (tai khoan: Admin hoac NguoiDung thuong)
-- ------------------------------------------------------------
CREATE TABLE NguoiDung (
    maNguoiDung     INT AUTO_INCREMENT PRIMARY KEY,
    hoTen           VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    soDienThoai     VARCHAR(15),
    matKhau         VARCHAR(255) NOT NULL,  -- luu hash (bcrypt), khong luu plain text
    vaiTro          ENUM('Admin','NguoiDung') NOT NULL DEFAULT 'NguoiDung',
    ngayTao         DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Bang Phong (tin dang cho thue phong tro)
-- 1 NguoiDung - N Phong (nguoi dang tin)
-- ------------------------------------------------------------
CREATE TABLE Phong (
    maPhong         INT AUTO_INCREMENT PRIMARY KEY,
    tieuDe          VARCHAR(150) NOT NULL,
    moTa            TEXT,
    diaChi          VARCHAR(255) NOT NULL,
    quanHuyen       VARCHAR(100),
    gia             DECIMAL(12,2) NOT NULL,
    dienTich        FLOAT,
    hinhAnh         VARCHAR(500),
    trangThai       ENUM('ChoDuyet','DaDuyet','TuChoi','DaAn') NOT NULL DEFAULT 'ChoDuyet',
    maNguoiDang     INT NOT NULL,
    ngayDang        DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (maNguoiDang) REFERENCES NguoiDung(maNguoiDung)
);

-- ------------------------------------------------------------
-- Bang PhongYeuThich (tin da luu cua nguoi dung) - N-N giua NguoiDung va Phong
-- ------------------------------------------------------------
CREATE TABLE PhongYeuThich (
    maYeuThich      INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung     INT NOT NULL,
    maPhong         INT NOT NULL,
    ngayLuu         DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_yeuthich (maNguoiDung, maPhong),
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung) ON DELETE CASCADE,
    FOREIGN KEY (maPhong) REFERENCES Phong(maPhong) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Bang YeuCau (nguoi dung gui yeu cau lien he/xem phong)
-- ------------------------------------------------------------
CREATE TABLE YeuCau (
    maYeuCau            INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung         INT NOT NULL,
    maPhong             INT NOT NULL,
    hoTenLienHe         VARCHAR(100) NOT NULL,
    soDienThoaiLienHe   VARCHAR(15) NOT NULL,
    loiNhan             TEXT,
    trangThai           ENUM('ChoXuLy','DaLienHe','DaXuLy','DaHuy') NOT NULL DEFAULT 'ChoXuLy',
    ngayTao             DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung),
    FOREIGN KEY (maPhong) REFERENCES Phong(maPhong)
);

-- ============================================================
-- DU LIEU MAU
-- ============================================================

-- Tai khoan mau (mat khau da hash bang bcrypt, mat khau goc de test ghi ben duoi)
-- admin@timphongtro.vn   / admin123   (Admin)
-- an.nguyen@example.com  / user123    (NguoiDung - dang 3 tin)
-- binh.tran@example.com  / user123    (NguoiDung - da luu tin, gui yeu cau)
INSERT INTO NguoiDung (hoTen, email, soDienThoai, matKhau, vaiTro) VALUES
('Quản trị viên', 'admin@timphongtro.vn', '0900000000', '$2a$10$rn3Fchua.C22yqwcUqRW5.spEUm5NZ4XyxHXvocJf0SLgbflsl87i', 'Admin'),
('Nguyễn Văn An', 'an.nguyen@example.com', '0911111111', '$2a$10$Q7WVrLc70lLZj9WQnnM1U.jU0DzgeRMswoRT0C.HrMcxOqXMZXBrC', 'NguoiDung'),
('Trần Thị Bình', 'binh.tran@example.com', '0922222222', '$2a$10$Q7WVrLc70lLZj9WQnnM1U.jU0DzgeRMswoRT0C.HrMcxOqXMZXBrC', 'NguoiDung');

INSERT INTO Phong (tieuDe, moTa, diaChi, quanHuyen, gia, dienTich, hinhAnh, trangThai, maNguoiDang) VALUES
('Phòng trọ mới xây, gần trường ĐH Bách Khoa', 'Phòng sạch sẽ, an ninh, có gác lửng, giờ giấc tự do.', '12 Lý Thường Kiệt', 'Quận 10', 2800000, 20, NULL, 'DaDuyet', 2),
('Phòng trọ có gác, giá rẻ cho sinh viên', 'Khu vực yên tĩnh, gần chợ, xe bus thuận tiện.', '45 Nguyễn Trãi', 'Quận 5', 2200000, 16, NULL, 'DaDuyet', 2),
('Studio full nội thất, view đẹp', 'Có máy lạnh, tủ lạnh, giường nệm, phù hợp cặp đôi hoặc người đi làm.', '78 Điện Biên Phủ', 'Bình Thạnh', 4500000, 28, NULL, 'DaDuyet', 3),
('Phòng trọ giá rẻ gần khu công nghiệp', 'Phù hợp công nhân, có chỗ để xe, điện nước giá dân dụng.', '9 Tô Ký', 'Quận 12', 1800000, 15, NULL, 'DaDuyet', 2),
('Căn hộ mini mới, an ninh 24/7', 'Có bảo vệ, thang máy, camera an ninh toàn khu.', '156 Cách Mạng Tháng 8', 'Quận 3', 5200000, 30, NULL, 'ChoDuyet', 3),
('Phòng trọ cho thuê gấp', 'Cần cho thuê gấp do chuyển công tác, giá thương lượng.', '23 Lê Văn Sỹ', 'Quận Tân Bình', 2600000, 18, NULL, 'TuChoi', 2);

INSERT INTO PhongYeuThich (maNguoiDung, maPhong) VALUES
(3, 1),
(3, 2);

INSERT INTO YeuCau (maNguoiDung, maPhong, hoTenLienHe, soDienThoaiLienHe, loiNhan, trangThai) VALUES
(3, 1, 'Trần Thị Bình', '0922222222', 'Mình muốn xem phòng vào cuối tuần này, liên hệ giúp mình nhé.', 'ChoXuLy'),
(3, 3, 'Trần Thị Bình', '0922222222', 'Phòng còn trống không ạ? Mình ở 2 người.', 'DaLienHe');

-- ============================================================
-- TAO USER RIENG CHO UNG DUNG (dung ket noi tu server Node.js)
-- Luu y: KHONG nen cho backend ket noi bang tai khoan root.
-- Doi lai mat khau nay truoc khi dung that.
-- ============================================================
CREATE USER IF NOT EXISTS 'timphongtro_app'@'%' IDENTIFIED BY 'timphongtro_pass123';
GRANT ALL PRIVILEGES ON tim_phong_tro.* TO 'timphongtro_app'@'%';
FLUSH PRIVILEGES;
