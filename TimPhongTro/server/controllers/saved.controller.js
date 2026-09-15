const pool = require('../config/db');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.list = wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, s.ngayLuu
     FROM PhongYeuThich s JOIN Phong p ON s.maPhong = p.maPhong
     WHERE s.maNguoiDung = ? ORDER BY s.ngayLuu DESC`,
    [req.user.id]
  );
  res.json(rows);
});

exports.save = wrap(async (req, res) => {
  const maPhong = req.params.maPhong;
  const [[room]] = await pool.query('SELECT maPhong FROM Phong WHERE maPhong = ?', [maPhong]);
  if (!room) return res.status(404).json({ error: 'Không tìm thấy phòng.' });
  await pool.query('INSERT IGNORE INTO PhongYeuThich (maNguoiDung, maPhong) VALUES (?, ?)', [req.user.id, maPhong]);
  res.status(201).json({ ok: true });
});

exports.unsave = wrap(async (req, res) => {
  await pool.query('DELETE FROM PhongYeuThich WHERE maNguoiDung = ? AND maPhong = ?', [req.user.id, req.params.maPhong]);
  res.json({ ok: true });
});
