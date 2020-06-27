var express = require('express');
var router = express.Router();
const roomController = require('../controllers/roomController');
const authUtil = require('../module/authUtil');

router.post('/', authUtil.checkToken,roomController.createRoom);
router.get('/', roomController.readRoom)
router.get('/all', roomController.readAllRoom);
router.get('/type', roomController.readRoomByType)

module.exports = router;
