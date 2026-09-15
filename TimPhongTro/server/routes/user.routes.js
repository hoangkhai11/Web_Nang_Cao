const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const ctrl = require('../controllers/user.controller');

router.get('/me', auth, ctrl.getMe);
router.put('/me', auth, ctrl.updateMe);
router.put('/me/matkhau', auth, ctrl.changePassword);
router.get('/', auth, adminOnly, ctrl.listAll);
router.delete('/:id', auth, adminOnly, ctrl.remove);

module.exports = router;
