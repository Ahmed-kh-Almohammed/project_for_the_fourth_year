const express = require('express');
const lifeTimeController = require('../controllers/lifeTimeController');

const router = express.Router();

router.get('/', lifeTimeController.lifeTimeGet);
router.post('/', lifeTimeController.lifeTimePost);
router.post('/delete', lifeTimeController.lifeTimeDelete);


module.exports = router;