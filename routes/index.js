const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

router.post('/process', indexController.process);

module.exports = router;
