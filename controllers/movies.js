const Movie = require('../models/movie');
const {
  SUCCESSFUL_STATUS_CODE,
  CAST_OR_VALIDATION_ERROR_MESSAGE,
  NOT_FOUND_DATA_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
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
        next(new BadReqError(CAST_OR_VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError(NOT_FOUND_DATA_MESSAGE))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw (new ForbiddenError(FORBIDDEN_ERROR_MESSAGE));
      }
      Movie.findByIdAndRemove(req.params.id)
        .then((removedMovie) => res.status(SUCCESSFUL_STATUS_CODE).send(removedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError(CAST_OR_VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};
