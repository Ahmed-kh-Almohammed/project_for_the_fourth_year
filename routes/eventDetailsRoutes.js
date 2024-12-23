const express = require('express');
const eventDetailsController = require('../controllers/eventDetailsController');
const db = require('../models/database.js');
const router = express.Router();
router.delete('/:id', eventDetailsController.eventDetailsDelete);
router.get('/', eventDetailsController.eventDetailsGet);
router.get('/:id', eventDetailsController.eventDetailsGet);
router.post('/:id', eventDetailsController.eventDetailsPost);
router.post('/', eventDetailsController.eventDetailsPost);

module.exports = router;