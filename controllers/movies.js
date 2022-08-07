const Movie = require('../models/movie');
const {
  SUCCESSFUL_STATUS_CODE,
} = require('../constants/errors');

const BadReqError = require('../errors/BadReqError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    // .populate('owner')
    .then((movies) => res.status(SUCCESSFUL_STATUS_CODE).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(SUCCESSFUL_STATUS_CODE).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw (new ForbiddenError('У вас нет необходимых прав для удаления.'));
      }
      Movie.findByIdAndRemove(req.params.id)
        .then((removedMovie) => res.status(SUCCESSFUL_STATUS_CODE).send(removedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для удаления фильма'));
      } else {
        next(err);
      }
    });
};
