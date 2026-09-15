const adminService = require('../services/admin.service');
const roomService = require('../services/room.service');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.dashboard = wrap(async (req, res) => {
  const stats = await adminService.dashboardStats();
  res.json(stats);
});

exports.listRooms = wrap(async (req, res) => {
  const rows = await roomService.listAdmin(req.query);
  res.json(rows);
});

exports.setRoomStatus = wrap(async (req, res) => {
  const result = await roomService.setStatus(req.params.id, req.body.trangThai);
  res.json(result);
});
