const express = require('express');
const moviesController = require('../controllers/movies');
const authMiddleware = require('../middlewares/auth');
const {
  deleteMovieByIdValidation,
  createMovieValidation,
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', moviesController.getMovies);
router.post('/', [authMiddleware, createMovieValidation], moviesController.createMovie);
router.delete('/:movieId', [authMiddleware, deleteMovieByIdValidation], moviesController.deleteMovieById);

module.exports = router;
