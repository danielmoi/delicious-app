const express = require('express');
const { homePage, addStore, createStore } = require('../controllers/storeController');

const router = express.Router();

// Do work here
router.get('/', homePage);
router.get('/add', addStore);
router.post('/add', createStore);

module.exports = router;
