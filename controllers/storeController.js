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
const User = mongoose.model('User');

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

const confirmOwner = (store, user) => {
  if (store.author && !store.author.equals(user._id)) {
    throw Error('You must own a store in order to edit it!');
  }
};

const editStore = async (req, res) => {
  // 1. Find the store
  const store = await Store.findById(req.params.id);

  // 2. Confirm they are the owner of that store
  confirmOwner(store, req.user);

  // 3. Render edit form
  res.render('editStore', {
    title: `Edit ${store.name}`,
    store,
  });
};

const createStore = async (req, res) => {
  const data = req.body;
  const store = new Store(data);
  store.author = req.user._id,
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
  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;

  const storesPromise = Store
    .find()
    .skip(skip)
    .limit(limit)
    .sort({
      created: 'desc',
    });

    // we could call populate
    // .populate('reviews'); // this is get Store.reviews (relationship)
    // but we will use our autopopulate instead

  const storesCountPromise = Store.count();

  const [stores, count] = await Promise.all([storesPromise, storesCountPromise]);

  const pages = Math.ceil(count / limit);

  if (!stores.length && skip) {
    req.flash('info', `Hey! You asked for page ${page}. But that page doesn't exist, so I put you on page ${pages}`);
    res.redirect(`/stores/page/${pages}`);
    return;
  }

  res.render('stores', {
    title: 'Stores',
    stores,
    pages,
    page,
    count,
  });
};

const getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({
    slug: req.params.slug,
  }).populate('author');
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

const searchStores = async (req, res) => {
  const results = await Store
  // 1. find stores
  .find({
    $text: {
      $search: req.query.q,
    },
  }, {
    score: {
      $meta: 'textScore',
    },
  })
  // 2. sort
  .sort({
    score: {
      $meta: 'textScore',
    },
  })
  // 3. limit
  .limit(5);

  res.json(results);
};
// module.exports.searchStores = async (req, res) => {
//   res.json({
//     it: 'works',
//   });
// };

const mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);

  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates,
        },
        $maxDistance: 10000, // 10 km
      }
    }
  }

  const stores = await Store
    .find(query)
    .select('slug name description location photo');
  res.json(stores);
};

const mapPage = async (req, res) => {
  res.render('map', {
    title: 'Map',
  });
};

/* --- HEARTS ------------------------ */
const heartStore = async (req, res) => {
  const hearts = req.user.hearts.map(heart => heart.toString());

  const operator = hearts.includes(req.params.id)
    ? '$pull'
    : '$addToSet'; // this will make it a unique set (to be safe)

  const user = await User.findByIdAndUpdate(req.user._id, {
    [operator]: {
      hearts: req.params.id,
    }}, {
      new: true, // return updated user
    });
  res.json(user);
};

const getHearts = async (req, res) => {
  const stores = await Store.find({
    _id: {
      $in: req.user.hearts,
    },
  });
  res.render('stores', {
    title: 'Hearted',
    stores,
  });
};

const getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();
  res.render('topStores', {
    stores,
    title: 'Top Stores',
  });
};

/* --- URGHHH ------------------------ */
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
  searchStores,
  mapStores,
  mapPage,
  heartStore,
  getHearts,
  getTopStores,
};
