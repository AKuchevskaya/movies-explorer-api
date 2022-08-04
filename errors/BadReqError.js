const { CAST_OR_VALIDATION_ERROR_CODE } = require('../constants/errors');

class BadReqError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CAST_OR_VALIDATION_ERROR_CODE;
  }
}

module.exports = BadReqError;
