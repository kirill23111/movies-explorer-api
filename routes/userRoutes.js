const express = require('express');
const usersController = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const {
  updateProfileValidation,
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', authMiddleware, usersController.getUsers);
router.get('/me', authMiddleware, usersController.getCurrentUser);
router.patch('/me', authMiddleware, updateProfileValidation, usersController.updateProfile);

module.exports = router;
