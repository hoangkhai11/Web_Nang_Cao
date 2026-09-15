// Chi cho phep vai tro Admin di tiep. Phai dat sau middleware auth (can req.user).
function adminOnly(req, res, next) {
  if (!req.user || req.user.vaiTro !== 'Admin') {
    return res.status(403).json({ error: 'Chỉ Admin mới có quyền thực hiện thao tác này.' });
  }
  next();
}

module.exports = adminOnly;
