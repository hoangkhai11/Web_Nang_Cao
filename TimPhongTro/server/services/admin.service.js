const pool = require('../config/db');

async function dashboardStats() {
  const [[roomStats]] = await pool.query(`
    SELECT COUNT(*) AS tongPhong,
           SUM(trangThai = 'ChoDuyet') AS choDuyet,
           SUM(trangThai = 'DaDuyet') AS daDuyet,
           SUM(trangThai = 'TuChoi') AS tuChoi,
           SUM(trangThai = 'DaAn') AS daAn
    FROM Phong
  `);
  const [[userStats]] = await pool.query(
    `SELECT COUNT(*) AS tongNguoiDung FROM NguoiDung WHERE vaiTro = 'NguoiDung'`
  );
  const [[requestStats]] = await pool.query(`
    SELECT COUNT(*) AS tongYeuCau, SUM(trangThai = 'ChoXuLy') AS choXuLy
    FROM YeuCau
  `);
  const [phongTheoQuan] = await pool.query(`
    SELECT COALESCE(quanHuyen,'Khác') AS quanHuyen, COUNT(*) AS soLuong
    FROM Phong WHERE trangThai = 'DaDuyet'
    GROUP BY quanHuyen ORDER BY soLuong DESC
  `);
  return { ...roomStats, ...userStats, ...requestStats, phongTheoQuan };
}

module.exports = { dashboardStats };
