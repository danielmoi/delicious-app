/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  // 1. STORAGE LOCATION
  // where will the file be stored when it's uploaded
  // let's save it to memory because we don't want to keep the file
  // we are only going to save the resized image to file
  storage: multer.memoryStorage(),

  // 2. FILE TYPES
  // what types of files are allowed
  fileFilter(req, file, next) {
    console.log('file:', file);
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
      // the first value to next is an ERROR
      // the second is what needs to be passed
    } else {
      next({
        message: 'That file type is not allowed',
      }, false);
    }
  },
};

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

const upload = multer(multerOptions).single('photo');

const resize = async (req, res, next) => {
  // check if new file to resize
  if (!req.file) {
    next(); // skip to next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  // once we have written the photo to our filesystem, keep going!
  next();
}

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
  console.log('req.body:', req.body);
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

const getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({
    slug: req.params.slug,
  });
  if (!store) {
    next();
    return;
  }
  res.render('store', {
    store,
    title: store.name,
  });
};

const getStoresByTag = async (req, res, next) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });

  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

  res.render('tag', {
    title: 'Tags',
    tags,
    stores,
    tag,
  });
}

module.exports = {
  homePage,
  editStore,
  createStore,
  updateStore,
  getStores,
  getStoreBySlug,
  getStoresByTag,
  addStore,
  resize,
  upload,
};
