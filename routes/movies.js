const routerMovie = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const { regex } = require('../constants/regex');
const {
  createMovie,
  getMovies,
  deleteMovie,
  // likeMovie,
  // dislikeMovie,
} = require('../controllers/movies');

routerMovie.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
}), createMovie);

routerMovie.get('/', getMovies);

routerMovie.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

// routerMovie.put('/:movieId/likes', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().required().length(24).hex(),
//   }),
// }), likeMovie);

// routerMovie.delete('/:movieId/likes', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().required().length(24).hex(),
//   }),
// }), dislikeMovie);

module.exports = routerMovie;
