const routerUser = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUser,
  updateUser,
} = require('../controllers/users');

routerUser.get('/me', getUser);

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = routerUser;
