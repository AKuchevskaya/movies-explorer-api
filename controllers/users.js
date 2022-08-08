const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { SECRET_KEY } = require('../constants/config');

const {
  SUCCESSFUL_STATUS_CODE,
} = require('../constants/errors');

const BadReqError = require('../errors/BadReqError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY,
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
      // }).send({ token });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .then(() => {
      res.clearCookie('jwt', { httpOnly: true, sameSite: true })
        .send({ message: 'Пользователь больше не авторизован' });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))

    .then((user) => {
      const createdUser = user.toObject();
      delete createdUser.password;
      res.status(SUCCESSFUL_STATUS_CODE)
        .send({ data: createdUser });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError') {
        next(new ConflictError('Такой email уже существует.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Передан несуществующий _id пользователя'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      next(new NotFoundError('Передан несуществующий _id пользователя'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при обновлении профиля'));
      } if (err.name === 'MongoServerError') {
        next(new ConflictError('Такой email уже существует.'));
      } else {
        next(err);
      }
    });
};
