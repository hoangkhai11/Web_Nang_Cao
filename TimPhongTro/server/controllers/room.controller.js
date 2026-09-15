const roomService = require('../services/room.service');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.listPublic = wrap(async (req, res) => {
  const rows = await roomService.listPublic(req.query);
  res.json(rows);
});

exports.getPublic = wrap(async (req, res) => {
  const row = await roomService.getPublicById(req.params.id);
  res.json(row);
});

exports.listMine = wrap(async (req, res) => {
  const rows = await roomService.listMine(req.user.id);
  res.json(rows);
});

exports.create = wrap(async (req, res) => {
  const result = await roomService.create(req.body, req.user);
  res.status(201).json(result);
});

exports.update = wrap(async (req, res) => {
  const result = await roomService.update(req.params.id, req.body, req.user);
  res.json(result);
});

exports.remove = wrap(async (req, res) => {
  const result = await roomService.remove(req.params.id, req.user);
  res.json(result);
});
