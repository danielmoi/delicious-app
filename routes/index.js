const express = require('express');
const { homePage } = require('../controllers/storeController');

const router = express.Router();

// Do work here
router.get('/', homePage);

module.exports = router;
