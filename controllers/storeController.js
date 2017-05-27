/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const Store = mongoose.model('Store');

const homePage = (req, res) => {
  req.flash('warning', 'Warning');
  res.render('index', {
    name: req.name,
  });
};

const addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add store',
  });
};

const editStore = async (req, res) => {
  // 1. Find the store
  const store = await Store.findById(req.params.id);

  // 2. Confirm they are the owner of that store

  // 3. Render edit form
  res.render('editStore', {
    title: `Edit ${store.name}`,
    store,
  });
};

const createStore = async (req, res) => {
  const data = req.body;
  const store = new Store(data);
  await store.save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

const updateStore = async (req, res) => {
  // set location data to be a Point
  req.body.location.type = 'Point';

  const store = await Store.findOneAndUpdate({
    _id: req.params.id,
  }, req.body, {
    new: true, // return the new store, instead of the old one
    runValidators: true, // check with required in model schema (default is only on create)
  }).exec();

  req.flash('success', `Successfully updated ${store.name}.
    <a href="/store/${store.slug}">View store</a>
  `);
  res.redirect(`/stores/${store._id}/edit`);
};

const getStores = async (req, res) => {
  const stores = await Store.find();

  res.render('stores', {
    title: 'Stores',
    stores,
  });
};

module.exports = {
  homePage,
  addStore,
  editStore,
  createStore,
  updateStore,
  getStores,
};
