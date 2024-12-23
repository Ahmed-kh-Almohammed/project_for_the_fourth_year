const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/', profileController.profileGet);
router.post('/', profileController.profilePost);

module.exports = router;