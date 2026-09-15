const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const TOKEN_EXPIRES = '8h';

function badRequest(msg) { const e = new Error(msg); e.status = 400; return e; }
function unauthorized(msg) { const e = new Error(msg); e.status = 401; return e; }

function signToken(user) {
  const payload = { id: user.maNguoiDung, hoTen: user.hoTen, email: user.email, vaiTro: user.vaiTro };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

async function register({ hoTen, email, soDienThoai, matKhau }) {
  if (!hoTen || !email || !matKhau) throw badRequest('Vui lòng nhập họ tên, email và mật khẩu.');
  if (matKhau.length < 6) throw badRequest('Mật khẩu cần ít nhất 6 ký tự.');

  const hash = await bcrypt.hash(matKhau, 10);
  const [r] = await pool.query(
    'INSERT INTO NguoiDung (hoTen, email, soDienThoai, matKhau, vaiTro) VALUES (?, ?, ?, ?, "NguoiDung")',
    [hoTen, email, soDienThoai || null, hash]
  );
  const user = { maNguoiDung: r.insertId, hoTen, email, vaiTro: 'NguoiDung' };
  return { token: signToken(user), user };
}

async function login({ email, matKhau }) {
  if (!email || !matKhau) throw badRequest('Vui lòng nhập email và mật khẩu.');

  const [[u]] = await pool.query('SELECT * FROM NguoiDung WHERE email = ?', [email]);
  if (!u) throw unauthorized('Sai email hoặc mật khẩu.');

  const ok = await bcrypt.compare(matKhau, u.matKhau);
  if (!ok) throw unauthorized('Sai email hoặc mật khẩu.');

  const user = { maNguoiDung: u.maNguoiDung, hoTen: u.hoTen, email: u.email, vaiTro: u.vaiTro };
  return { token: signToken(user), user };
}

module.exports = { register, login };
