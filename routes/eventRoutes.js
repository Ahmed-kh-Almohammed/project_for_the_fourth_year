const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();


router.delete('/:id', eventController.eventDelete);
router.get('/', eventController.eventGet);
router.post('/', eventController.eventPost);
module.exports = router;