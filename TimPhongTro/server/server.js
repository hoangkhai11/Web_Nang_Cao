require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const userRoutes = require('./routes/user.routes');
const requestRoutes = require('./routes/request.routes');
const savedRoutes = require('./routes/saved.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'web')));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', adminRoutes);

// Khong tim thay endpoint API nao khop (dat sau tat ca router /api/*)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Không tìm thấy endpoint.' });
});

// Middleware xu ly loi tap trung: bat loi tu cac controller (qua wrap().catch(next))
// va loi rang buoc CSDL (unique / khoa ngoai) tra ve thong bao ro rang thay vi 500 chung chung.
app.use((err, req, res, next) => {
  if (err.errno === 1062) return res.status(409).json({ error: 'Dữ liệu bị trùng (email đã tồn tại).' });
  if (err.errno === 1451) return res.status(409).json({ error: 'Không thể xóa vì dữ liệu này đang được tham chiếu ở nơi khác.' });
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Lỗi máy chủ, vui lòng thử lại.' });
});

app.listen(PORT, () => {
  console.log(`TimPhongTro server đang chạy tại http://localhost:${PORT}`);
});
