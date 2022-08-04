const mongoose = require('mongoose');
const { regex } = require('../constants/regex');

// описываем модель
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Обязательно добавьте страну создания фильма'],
  },
  director: {
    type: String,
    required: [true, 'Обязательно добавьте режиссера фильма'],
  },
  duration: {
    type: Number,
    required: [true, 'Обязательно добавьте продолжительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'Обязательно добавьте год выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'Обязательно добавьте краткое описание фильма'],
  },
  image: {
    type: String,
    required: [true, 'Обязательно добавьте ссылку на постер к фильму'],
    validate: {
      validator(v) { return regex.test(v); },
      message: () => 'Неверный формат ссылки на трейлер',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Обязательно добавьте ссылку на трейлер фильма'],
    validate: {
      validator(v) { return regex.test(v); },
      message: () => 'Неверный формат ссылки на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Обязательно добавьте ссылку на миниатюру постера к фильму'],
    validate: {
      validator(v) { return regex.test(v); },
      message: () => 'Неверный формат ссылки на трейлер',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле owner обязательное'],
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'Обязательно добавьте название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'Обязательно добавьте название фильма на английском языке'],
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('movie', movieSchema);
