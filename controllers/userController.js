const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

const loginForm = (req, res) => {
  res.render('login', {
    title: 'Login',
  });
};

const registerForm = (req, res) => {
  res.render('register', {
    title: 'Register',
  });
};

const validateRegister = (req, res, next) => {
  // this is from Express Validator
  req.sanitizeBody('name');

  // in case user's browser is not performing HTML5 validation
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That email is not valid!').notEmpty().isEmail();

  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });

  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmation password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match!')
    .equals(req.body.password);

  // this will invoke all the methods above, and put the errors into an errors object
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));

    // let's re-render, but DON'T WIPE DATA
    res.render('register', {
      title: 'Register',
      body: req.body,

      // make flashes available on the same page
      flashes: req.flash(),
    });
    return; // stop this function from proceeding further
  }

  next(); // there were no errors
};

const register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name,
  });
  // instead of calling .save(), we are going to call .register()
  // register is from passportLocalMongoose

  /*
  // register doesn't return a promise, it is callback based
  User.register(user, req.body.password, function(err, res) {

  });
  */

  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);

  next(); // pass to authController.login
};

const account = (req, res) => {
  res.render('account', {
    title: 'Edit your account',
  });
};

const updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    {
      new: true, // return the new/updated user
      runValidators: true,
      context: 'query',
    }
  );
  req.flash('success', 'Profile updated successfully');
  res.redirect('/account');
};

module.exports = {
  loginForm,
  registerForm,
  validateRegister,
  register,
  account,
  updateAccount,
};
