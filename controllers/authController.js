const passport = require('passport');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

// this is the AUTHENTICATION STRATEGY (which type of login we are wanting: Github, Twitter, etc)
// not a regular route, we are using passport's middlewares

// we need to configure our strategy first
// we get the user object on each request!
const login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!',
});

const logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
};

const isLoggedIn = (req, res, next) => {
  // check if user is authenticated
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Oops, you must be logged in first');
  res.redirect('/login');
};

const confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    return next();
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back');
};

const forgot = async (req, res) => {
  // 1. see if user with that email exists
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    req.flash('error', 'No account with that email exists. Security warning!!!!');
    return res.redirect('/login');
  }

  // 2. reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + (1000 * 60 * 60);
  await user.save();

  // 3. send them email with that token
  const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  req.flash('success', `You have been emailed a password reset link. ${resetUrl}`);

  // 4. redirect to login page
  res.redirect('/login');
};

const reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  // if there is a user
  res.render('reset', {
    title: 'Reset your password',
  });
};

const update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired!');
    return res.redirect('/login');
  }

  // made available on our model from passportJS
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Nice!, Your password has been reset!');
  res.redirect('/');
};

module.exports = {
  login,
  logout,
  isLoggedIn,
  forgot,
  reset,
  confirmedPasswords,
  update,
};
