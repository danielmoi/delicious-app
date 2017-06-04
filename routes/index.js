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
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

// Do work here
router.get('/', getStores);
router.get('/stores', catchErrors(getStores));
router.get('/store/:slug', catchErrors(getStoreBySlug));
router.get('/stores/:id/edit', catchErrors(editStore));

router.get('/add', authController.isLoggedIn, addStore);


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

/* --------------------------- */
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

router.post('/register',
  // 1. Validate the registration data
  userController.validateRegister,

  // 2. Register the user
  userController.register,

  // 3. Log the user in
  authController.login
);


router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', authController.isLoggedIn, catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

router.get('/logout', authController.logout);

module.exports = router;
