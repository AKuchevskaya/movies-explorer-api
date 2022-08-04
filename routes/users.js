const routerUser = require('express').Router();
const { Joi, celebrate } = require('celebrate');
// const { regex } = require('../constants/regex');
const {
  // getUsers,
  getUser,
  // findUser,
  updateUser,
  // updateAvatar,
  logout,
} = require('../controllers/users');

// routerUser.get('/', getUsers);

routerUser.get('/me', getUser);

// routerUser.get('/:userId', celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().required().length(24).hex(),
//   }),
// }), findUser);

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

routerUser.post('/signout', logout);

// routerUser.patch('/me/avatar', celebrate({
//   body: Joi.object().keys({
//   avatar: Joi.string().required().pattern(regex),
//   }),
// }), updateAvatar);

module.exports = routerUser;
