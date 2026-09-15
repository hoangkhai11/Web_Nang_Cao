const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const ctrl = require('../controllers/request.controller');

router.post('/', auth, ctrl.create);
router.get('/me', auth, ctrl.listMine);
router.get('/', auth, adminOnly, ctrl.listAll);
router.put('/:id/trangthai', auth, adminOnly, ctrl.updateStatus);

module.exports = router;
