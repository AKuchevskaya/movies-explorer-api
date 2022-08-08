const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const auth = require('../middlewares/auth');

const { login, createUser, logout } = require('../controllers/users');
const routerUser = require('./users');
const routerMovie = require('./movies');
const NotFoundError = require('../errors/NotFoundError'); // 404

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
// router.use(auth);
router.post('/signout', auth, logout);
router.use('/users', auth, routerUser);
router.use('/movies', auth, routerMovie);

router.use(auth, (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

module.exports = router;
