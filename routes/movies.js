const routerMovie = require('express').Router();
const { validationMovieData, validationMovieId } = require('../middlewares/validation');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

routerMovie.post('/', validationMovieData, createMovie);

routerMovie.get('/', getMovies);

routerMovie.delete('/:id', validationMovieId, deleteMovie);

module.exports = routerMovie;
