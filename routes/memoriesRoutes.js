
const express = require('express');
const memoriesController = require('../controllers/memoriesController');
const db = require('../models/database.js');
const router = express.Router();
router.delete('/:id', memoriesController.memoriesDelete);
router.get('/', memoriesController.memoryGet);
router.get('/:id', memoriesController.memoryGet);
router.post('/', memoriesController.memoryPost);
router.post('/:id', memoriesController.memoryPost);

module.exports = router;