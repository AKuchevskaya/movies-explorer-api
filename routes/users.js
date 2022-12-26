const routerUser = require('express').Router();
const { validationUserUpdatedData } = require('../middlewares/validation');
const {
  getUser,
  updateUser,
} = require('../controllers/users');

routerUser.get('/me', getUser);

routerUser.patch('/me', validationUserUpdatedData, updateUser);

module.exports = routerUser;
