const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.getMe = wrap(async (req, res) => {
  const [[u]] = await pool.query(
    'SELECT maNguoiDung, hoTen, email, soDienThoai, vaiTro, ngayTao FROM NguoiDung WHERE maNguoiDung = ?',
    [req.user.id]
  );
  if (!u) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  res.json(u);
});

exports.updateMe = wrap(async (req, res) => {
  const { hoTen, soDienThoai } = req.body;
  if (!hoTen) return res.status(400).json({ error: 'Vui lòng nhập họ tên.' });
  await pool.query('UPDATE NguoiDung SET hoTen = ?, soDienThoai = ? WHERE maNguoiDung = ?', [
    hoTen, soDienThoai || null, req.user.id,
  ]);
  res.json({ ok: true });
});

exports.changePassword = wrap(async (req, res) => {
  const { matKhauCu, matKhauMoi } = req.body;
  if (!matKhauCu || !matKhauMoi) return res.status(400).json({ error: 'Vui lòng nhập mật khẩu cũ và mới.' });
  if (matKhauMoi.length < 6) return res.status(400).json({ error: 'Mật khẩu mới cần ít nhất 6 ký tự.' });

  const [[u]] = await pool.query('SELECT matKhau FROM NguoiDung WHERE maNguoiDung = ?', [req.user.id]);
  const ok = await bcrypt.compare(matKhauCu, u.matKhau);
  if (!ok) return res.status(401).json({ error: 'Mật khẩu cũ không đúng.' });

  const hash = await bcrypt.hash(matKhauMoi, 10);
  await pool.query('UPDATE NguoiDung SET matKhau = ? WHERE maNguoiDung = ?', [hash, req.user.id]);
  res.json({ ok: true });
});

exports.listAll = wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT maNguoiDung, hoTen, email, soDienThoai, vaiTro, ngayTao FROM NguoiDung ORDER BY maNguoiDung'
  );
  res.json(rows);
});

exports.remove = wrap(async (req, res) => {
  const id = req.params.id;
  if (Number(id) === req.user.id) return res.status(409).json({ error: 'Không thể tự xóa tài khoản đang đăng nhập.' });

  const [[u]] = await pool.query('SELECT vaiTro FROM NguoiDung WHERE maNguoiDung = ?', [id]);
  if (!u) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  if (u.vaiTro === 'Admin') {
    const [[{ soAdmin }]] = await pool.query("SELECT COUNT(*) AS soAdmin FROM NguoiDung WHERE vaiTro = 'Admin'");
    if (soAdmin <= 1) return res.status(409).json({ error: 'Không thể xóa: đây là tài khoản Admin cuối cùng.' });
  }
  await pool.query('DELETE FROM NguoiDung WHERE maNguoiDung = ?', [id]);
  res.json({ ok: true });
});
