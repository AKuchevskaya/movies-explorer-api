const router = require('express').Router();

const auth = require('../middlewares/auth');

const { login, createUser, logout } = require('../controllers/users');
const routerUser = require('./users');
const routerMovie = require('./movies');
const NotFoundError = require('../errors/NotFoundError'); // 404
const { NOT_FOUND_ERROR_MESSAGE } = require('../constants/errors');
const { validationUserData, validationAuth } = require('../middlewares/validation');

router.post('/signup', validationUserData, createUser);
router.post('/signin', validationAuth, login);
router.post('/signout', auth, logout);
router.use('/users', auth, routerUser);
router.use('/movies', auth, routerMovie);

router.use(auth, (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
});

module.exports = router;
