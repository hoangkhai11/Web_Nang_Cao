const pool = require('../config/db');

function notFound(msg) { const e = new Error(msg || 'Không tìm thấy phòng.'); e.status = 404; return e; }
function forbidden(msg) { const e = new Error(msg || 'Bạn không có quyền thực hiện thao tác này.'); e.status = 403; return e; }
function badRequest(msg) { const e = new Error(msg); e.status = 400; return e; }

async function listPublic({ q, quanHuyen, giaMin, giaMax, dienTichMin }) {
  let sql = `
    SELECT p.*, u.hoTen AS tenNguoiDang
    FROM Phong p JOIN NguoiDung u ON p.maNguoiDang = u.maNguoiDung
    WHERE p.trangThai = 'DaDuyet'`;
  const params = [];
  if (q) { sql += ' AND (p.tieuDe LIKE ? OR p.diaChi LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (quanHuyen) { sql += ' AND p.quanHuyen = ?'; params.push(quanHuyen); }
  if (giaMin) { sql += ' AND p.gia >= ?'; params.push(giaMin); }
  if (giaMax) { sql += ' AND p.gia <= ?'; params.push(giaMax); }
  if (dienTichMin) { sql += ' AND p.dienTich >= ?'; params.push(dienTichMin); }
  sql += ' ORDER BY p.ngayDang DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getPublicById(id) {
  const [[row]] = await pool.query(
    `SELECT p.*, u.hoTen AS tenNguoiDang, u.soDienThoai AS sdtNguoiDang
     FROM Phong p JOIN NguoiDung u ON p.maNguoiDang = u.maNguoiDung
     WHERE p.maPhong = ? AND p.trangThai = 'DaDuyet'`,
    [id]
  );
  if (!row) throw notFound();
  return row;
}

async function listMine(maNguoiDung) {
  const [rows] = await pool.query('SELECT * FROM Phong WHERE maNguoiDang = ? ORDER BY maPhong DESC', [maNguoiDung]);
  return rows;
}

async function create(data, user) {
  const { tieuDe, moTa, diaChi, quanHuyen, gia, dienTich, hinhAnh } = data;
  if (!tieuDe || !diaChi || !gia) throw badRequest('Vui lòng nhập tiêu đề, địa chỉ và giá thuê.');

  const trangThai = user.vaiTro === 'Admin' ? 'DaDuyet' : 'ChoDuyet';
  const [r] = await pool.query(
    `INSERT INTO Phong (tieuDe, moTa, diaChi, quanHuyen, gia, dienTich, hinhAnh, trangThai, maNguoiDang)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tieuDe, moTa || null, diaChi, quanHuyen || null, gia, dienTich || null, hinhAnh || null, trangThai, user.id]
  );
  return { maPhong: r.insertId, trangThai };
}

async function findById(id) {
  const [[row]] = await pool.query('SELECT * FROM Phong WHERE maPhong = ?', [id]);
  if (!row) throw notFound();
  return row;
}

function assertCanEdit(room, user) {
  if (user.vaiTro !== 'Admin' && room.maNguoiDang !== user.id) throw forbidden();
}

async function update(id, data, user) {
  const room = await findById(id);
  assertCanEdit(room, user);

  const { tieuDe, moTa, diaChi, quanHuyen, gia, dienTich, hinhAnh } = data;
  // Nguoi dang thuong sua tin -> dua tin ve trang thai cho duyet lai; Admin sua thi giu nguyen trang thai.
  const trangThai = user.vaiTro === 'Admin' ? room.trangThai : 'ChoDuyet';
  await pool.query(
    `UPDATE Phong SET tieuDe=?, moTa=?, diaChi=?, quanHuyen=?, gia=?, dienTich=?, hinhAnh=?, trangThai=?
     WHERE maPhong = ?`,
    [
      tieuDe ?? room.tieuDe, moTa ?? room.moTa, diaChi ?? room.diaChi, quanHuyen ?? room.quanHuyen,
      gia ?? room.gia, dienTich ?? room.dienTich, hinhAnh ?? room.hinhAnh, trangThai, id,
    ]
  );
  return { ok: true };
}

async function remove(id, user) {
  const room = await findById(id);
  assertCanEdit(room, user);
  await pool.query('DELETE FROM Phong WHERE maPhong = ?', [id]);
  return { ok: true };
}

async function listAdmin({ trangThai, q }) {
  let sql = `
    SELECT p.*, u.hoTen AS tenNguoiDang
    FROM Phong p JOIN NguoiDung u ON p.maNguoiDang = u.maNguoiDung
    WHERE 1=1`;
  const params = [];
  if (trangThai) { sql += ' AND p.trangThai = ?'; params.push(trangThai); }
  if (q) { sql += ' AND (p.tieuDe LIKE ? OR p.diaChi LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY p.maPhong DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function setStatus(id, trangThai) {
  const allowed = ['ChoDuyet', 'DaDuyet', 'TuChoi', 'DaAn'];
  if (!allowed.includes(trangThai)) throw badRequest('Trạng thái không hợp lệ.');
  await findById(id);
  await pool.query('UPDATE Phong SET trangThai = ? WHERE maPhong = ?', [trangThai, id]);
  return { ok: true };
}

module.exports = { listPublic, getPublicById, listMine, create, findById, update, remove, listAdmin, setStatus };
