const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.render('hello', { magic: '🌶' });
  // res.send('Hey! It works!');
});

module.exports = router;