const {
  SERVER_ERROR_CODE,
  SERVER_ERROR_MESSAGE,
} = require('../constants/errors');

module.exports = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR_CODE } = err;
  const message = statusCode === SERVER_ERROR_CODE ? SERVER_ERROR_MESSAGE : err.message;
  res.status(err.statusCode).send({ message });
  next();
};
