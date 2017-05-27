const express = require('express');
const {
  homePage,
  addStore,
  editStore,
  createStore,
  updateStore,
  getStores,
} = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

// Do work here
router.get('/', getStores);
router.get('/stores', catchErrors(getStores));
router.get('/stores/:id/edit', catchErrors(editStore));

router.get('/add', addStore);

router.post('/add', catchErrors(createStore));
router.post('/add/:id', catchErrors(updateStore));

module.exports = router;
