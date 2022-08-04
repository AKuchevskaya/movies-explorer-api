const Movie = require('../models/movie');
const {
  SUCCESSFUL_STATUS_CODE,
} = require('../constants/errors');

const BadReqError = require('../errors/BadReqError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    // .populate('owner')
    .then((movies) => res.status(SUCCESSFUL_STATUS_CODE).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;

  Movie.create({ name, link, owner: req.user._id })
    .then((movie) => {
      res.status(SUCCESSFUL_STATUS_CODE).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw (new ForbiddenError('У вас нет необходимых прав для удаления.'));
      }
      Movie.findByIdAndRemove({ _id: req.params.movieId })
        .then((removedMovie) => res.status(SUCCESSFUL_STATUS_CODE).send(removedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    { _id: req.params.movieId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((movie) => res.status(SUCCESSFUL_STATUS_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки/снятия лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    { _id: req.params.movieId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((movie) => res.status(SUCCESSFUL_STATUS_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки/снятия лайка'));
      } else {
        next(err);
      }
    });
};
