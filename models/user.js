const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// const { regex } = require('../constants/regex');
const { UNAUTHORIZED_ERROR_MESSAGE } = require('../constants/errors');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

// описываем модель
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле email обязательное'],
    unique: [true, 'Пользователь с такой почтой уже существует'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Неверный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательно придумайте уникальный пароль'],
    select: false, // запрет на возвращение пароля
  },
  name: {
    type: String,
    required: [true, 'Поле name обязательное'],
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Имя слишком длинное, максимум 30 символов'],
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
