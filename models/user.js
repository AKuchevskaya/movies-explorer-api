const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// const { regex } = require('../constants/regex');
const {
  UNAUTHORIZED_ERROR_MESSAGE,
  TOTAL_ERROR_CREATION_MESSAGE,
  WRONG_EMAIL_ERROR_MESSAGE,
  DUPLICATE_EMAIL_ERROR_MESSAGE,
  SHORT_WORD_ERROR_MESSAGE,
  LONG_WORD_ERROR_MESSAGE,
} = require('../constants/errors');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

// описываем модель
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
    unique: [true, DUPLICATE_EMAIL_ERROR_MESSAGE],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => WRONG_EMAIL_ERROR_MESSAGE,
    },
  },
  password: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
    select: false, // запрет на возвращение пароля
  },
  name: {
    type: String,
    required: [true, TOTAL_ERROR_CREATION_MESSAGE],
    minlength: [2, SHORT_WORD_ERROR_MESSAGE],
    maxlength: [30, LONG_WORD_ERROR_MESSAGE],
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
          }
          return user; // теперь user доступен
        });
    });
};

// создаем модель и экспортируем ее
module.exports = mongoose.model('user', userSchema);
