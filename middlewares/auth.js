const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { SECRET_KEY } = require('../constants/config');
const { UNAUTHORIZED_ERROR_MESSAGE } = require('../constants/errors');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const token = req.cookies.jwt;
  // console.log('token', req.cookies.jwt);
  if (!token) {
    throw new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE);
  }

  // верифицируем токен
  let payload;
  // console.log('token', token);

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE);
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
