const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// const { regex } = require('../constants/regex');
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
    minlength: [4, 'Длинна пароля должна составлять минимум 4 символа, содержать '],
    select: false, // запрет на возвращение пароля
  },
  name: {
    type: String,
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Имя слишком длинное, максимум 30 символов'],
  },
  // about: {
  //   type: String,
  //   default: 'Исследователь',
  //   minlength: [2, 'Расскажите о себе больше'],
  //   maxlength: [30, 'К сожалению это поле ограничено, максимум 30 символов'],
  // },
  // avatar: {
  //   type: String,
  //   default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  //   validate: {
  //     validator(v) { return regex.test(v); },
  //     message: () => 'Неверный формат ссылки на изображение',
  //   },
  // },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

// создаем модель и экспортируем ее
module.exports = mongoose.model('user', userSchema);
