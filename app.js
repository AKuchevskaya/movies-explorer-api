require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const routes = require('./routes/index');
const cors = require('./middlewares/cors');
const { limiter } = require('./middlewares/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { LOCAL_DB } = require('./constants/config');

const { NODE_ENV, PORT = 3000, DB } = process.env;
const app = express();
const {
  CAST_OR_VALIDATION_ERROR_MESSAGE,
  CRASH_ERROR_MESSAGE,
} = require('./constants/errors');
const centralErrorsHandler = require('./middlewares/centralErrorsHandler');

mongoose.connect(NODE_ENV === 'production' ? DB : LOCAL_DB);
app.use(cors); // подключаем cors
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/crash-test', () => { // краш-тест сервера
  setTimeout(() => {
    throw new Error(CRASH_ERROR_MESSAGE);
  }, 0);
});

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(routes);

app.use(errorLogger);

app.use(errors({ message: CAST_OR_VALIDATION_ERROR_MESSAGE }));

app.use(centralErrorsHandler);

app.listen(PORT, () => {
  console.log('App started', PORT);
});
