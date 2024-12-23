const express = require('express');
const servicesController = require('../controllers/servicesController');

const router = express.Router();

router.get('/', servicesController.servicesGet);
router.post('/', servicesController.servicesPostOne);
module.exports = router;