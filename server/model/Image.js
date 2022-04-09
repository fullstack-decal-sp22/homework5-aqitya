const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('image', ImageSchema);
