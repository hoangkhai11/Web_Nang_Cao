const requestService = require('../services/request.service');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.create = wrap(async (req, res) => {
  const result = await requestService.create(req.body, req.user);
  res.status(201).json(result);
});

exports.listMine = wrap(async (req, res) => {
  const rows = await requestService.listMine(req.user.id);
  res.json(rows);
});

exports.listAll = wrap(async (req, res) => {
  const rows = await requestService.listAll(req.query);
  res.json(rows);
});

exports.updateStatus = wrap(async (req, res) => {
  const result = await requestService.updateStatus(req.params.id, req.body.trangThai);
  res.json(result);
});
