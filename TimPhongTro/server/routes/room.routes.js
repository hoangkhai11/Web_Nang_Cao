const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/room.controller');

router.get('/', ctrl.listPublic);
router.get('/mine', auth, ctrl.listMine);
router.get('/:id', ctrl.getPublic);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
