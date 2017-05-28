const mongoose = require('mongoose');
const slug = require('slugs'); // allow us to make URL-friendly slugs

mongoose.Promise = global.Promise;

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name', // instead of just true, which will throw an ugly Mongoose error
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  photo: String,
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [{ // this is an ARRAY
      type: Number,
      required: 'You must supply coordinates',
    }],
    address: {
      type: String,
      required: 'You must supply an address',
    },
  },
});

storeSchema.pre('save', async function save(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);

  // find other stores with same slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({
    slug: slugRegEx,
  });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  next();
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([

    // step 1 in pipe = unzip
    { $unwind: '$tags' },

    // step 2 in pipeline = group and increment a count
    { $group: {
      _id: '$tags',
      count: { // create a new property!
        $sum: 1,
      },
    }},

    // step 3 = sort
    { $sort: {
      count: -1,
     }},
  ]);
};

module.exports = mongoose.model('Store', storeSchema);
