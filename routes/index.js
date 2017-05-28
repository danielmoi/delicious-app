const express = require('express');
const {
  homePage,
  addStore,
  editStore,
  createStore,
  updateStore,
  getStores,
  getStoreBySlug,
  getStoresByTag,
  upload,
  resize,
} = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

// Do work here
router.get('/', getStores);
router.get('/stores', catchErrors(getStores));
router.get('/store/:slug', catchErrors(getStoreBySlug));
router.get('/stores/:id/edit', catchErrors(editStore));

router.get('/add', addStore);


router.post('/add',
  upload,
  catchErrors(resize),
  catchErrors(createStore));

router.post('/add/:id',
  upload,
  catchErrors(resize),
  catchErrors(updateStore));

router.get('/tags', catchErrors(getStoresByTag));
router.get('/tags/:tag', catchErrors(getStoresByTag));

module.exports = router;
