const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/saved.controller');

router.get('/', auth, ctrl.list);
router.post('/:maPhong', auth, ctrl.save);
router.delete('/:maPhong', auth, ctrl.unsave);

module.exports = router;
