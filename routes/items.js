var express = require('express');
var router = express.Router();
const itemController = require('../controllers/itemController');
const upload = require('../config/multer');

router.post('/', upload.array('images', 5), itemController.addItem)
router.get('/', itemController.getItem)
module.exports = router;
