const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const ctrl = require('../controllers/admin.controller');

router.use(auth, adminOnly);
router.get('/dashboard', ctrl.dashboard);
router.get('/rooms', ctrl.listRooms);
router.put('/rooms/:id/trangthai', ctrl.setRoomStatus);

module.exports = router;
