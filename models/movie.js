const mongoose = require('mongoose');
const { regex } = require('../constants/regex');
const { TOTAL_ERROR_CREATION_MESSAGE, WRONG_LINK_ERROR_MESSAGE } = require('../constants/errors');

// описываем модель
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
  director: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
  duration: {
    type: Number,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
  year: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
  description: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
  image: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
    validate: {
      validator(v) { return regex.test(v); },
      message: () => WRONG_LINK_ERROR_MESSAGE,
    },
  },
  trailerLink: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
    validate: {
      validator(v) { return regex.test(v); },
      message: () => WRONG_LINK_ERROR_MESSAGE,
    },
  },
  thumbnail: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
    validate: {
      validator(v) { return regex.test(v); },
      message: () => WRONG_LINK_ERROR_MESSAGE,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
  nameEN: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('movie', movieSchema);
