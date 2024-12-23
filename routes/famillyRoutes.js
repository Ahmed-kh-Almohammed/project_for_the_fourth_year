const express = require('express');
const famillyController = require('../controllers/famillyController');

const router = express.Router();

router.get('/', famillyController.famillyGet);
router.post('/', famillyController.famillyPost);

module.exports = router;