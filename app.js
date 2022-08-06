require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const { login, createUser, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const routerUser = require('./routes/users');
const routerMovie = require('./routes/movies');
const cors = require('./middlewares/cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { LOCAL_DB } = require('./constants/config');

const { NODE_ENV, PORT = 3000, DB } = process.env;
const app = express();
const {
  SERVER_ERROR_CODE,
} = require('./constants/errors');

const NotFoundError = require('./errors/NotFoundError'); // 404

mongoose.connect(NODE_ENV === 'production' ? DB : LOCAL_DB);
app.use(cors); // подключаем cors
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/crash-test', () => { // краш-тест сервера
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger); // подключаем логгер запросов
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);
app.use(auth);
app.post('/signout', logout);
app.use('/users', routerUser);
app.use('/movies', routerMovie);
app.use(errorLogger);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors({ message: 'Проверьте корректность введенных данных' }));

app.use((err, req, res, next) => {
  if (err.statusCode === 500) {
    res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
    next();
  }
});

app.listen(PORT, () => {
  console.log('App started', PORT);
});
