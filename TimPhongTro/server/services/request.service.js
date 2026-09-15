const pool = require('../config/db');

function notFound(msg) { const e = new Error(msg || 'Không tìm thấy.'); e.status = 404; return e; }
function badRequest(msg) { const e = new Error(msg); e.status = 400; return e; }

async function create({ maPhong, hoTenLienHe, soDienThoaiLienHe, loiNhan }, user) {
  if (!maPhong || !hoTenLienHe || !soDienThoaiLienHe) {
    throw badRequest('Vui lòng chọn phòng và nhập họ tên, số điện thoại liên hệ.');
  }
  const [[room]] = await pool.query('SELECT maPhong FROM Phong WHERE maPhong = ?', [maPhong]);
  if (!room) throw notFound('Không tìm thấy phòng.');

  const [r] = await pool.query(
    `INSERT INTO YeuCau (maNguoiDung, maPhong, hoTenLienHe, soDienThoaiLienHe, loiNhan, trangThai)
     VALUES (?, ?, ?, ?, ?, "ChoXuLy")`,
    [user.id, maPhong, hoTenLienHe, soDienThoaiLienHe, loiNhan || null]
  );
  return { maYeuCau: r.insertId };
}

async function listMine(maNguoiDung) {
  const [rows] = await pool.query(
    `SELECT y.*, p.tieuDe, p.diaChi, p.hinhAnh
     FROM YeuCau y JOIN Phong p ON y.maPhong = p.maPhong
     WHERE y.maNguoiDung = ? ORDER BY y.maYeuCau DESC`,
    [maNguoiDung]
  );
  return rows;
}

async function listAll({ trangThai }) {
  let sql = `
    SELECT y.*, p.tieuDe, p.diaChi, u.hoTen AS tenNguoiGui, u.email AS emailNguoiGui
    FROM YeuCau y
    JOIN Phong p ON y.maPhong = p.maPhong
    JOIN NguoiDung u ON y.maNguoiDung = u.maNguoiDung
    WHERE 1=1`;
  const params = [];
  if (trangThai) { sql += ' AND y.trangThai = ?'; params.push(trangThai); }
  sql += ' ORDER BY y.maYeuCau DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function updateStatus(id, trangThai) {
  const allowed = ['ChoXuLy', 'DaLienHe', 'DaXuLy', 'DaHuy'];
  if (!allowed.includes(trangThai)) throw badRequest('Trạng thái không hợp lệ.');
  await pool.query('UPDATE YeuCau SET trangThai = ? WHERE maYeuCau = ?', [trangThai, id]);
  return { ok: true };
}

module.exports = { create, listMine, listAll, updateStatus };
