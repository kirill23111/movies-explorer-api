const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { SUCCESS, CREATED } = require('../constans/codes');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => res.status(SUCCESS).send(movies))
    .catch((error) => next(error));
};

const createMovie = async (req, res, next) => {
  try {
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

    const movie = await new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user.id,
      movieId,
      nameRU,
      nameEN,
    });

    const savedMovie = await movie.save();

    return res.status(CREATED).send(savedMovie);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(`${error.message}`));
    }
    return next(error);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;
    const movie = await Movie.findById(movieId);

    if (movie === null) {
      return next(new NotFound('Фильм не найден'));
    }
    if (movie.owner.toString() !== userId) {
      return next(new Forbidden('Вы не можете удалить чужой фильм'));
    }

    await Movie.deleteOne({ _id: movieId });

    return res.json({ message: 'Фильм успешно удален' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
