const express = require('express');
const {
  getMovies,
  deleteMovieById,
  createMovie,
} = require('../controllers/movies');
const authMiddleware = require('../middlewares/auth');
const {
  deleteMovieByIdValidation,
  createMovieValidation,
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', getMovies);
router.post('/', [authMiddleware, createMovieValidation], createMovie);
router.delete('/:movieId', [authMiddleware, deleteMovieByIdValidation], deleteMovieById);

module.exports = router;
