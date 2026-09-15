const authService = require('../services/auth.service');

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.register = wrap(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

exports.login = wrap(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

exports.me = wrap(async (req, res) => {
  res.json(req.user);
});
