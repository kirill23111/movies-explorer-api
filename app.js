const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');

const app = express();
const { errors } = require('celebrate'); // Добавляем обработку ошибок celebrate
const {
  createUserValidation,
} = require('./middlewares/validation');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { login, registration } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/NotFound');
require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017//bitfilmsdb' } = process.env;
mongoose.connect(MONGO_URL);
const db = mongoose.connection;

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(requestLogger);
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

app.post('/signup', createUserValidation, registration);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

db.on('error', (error) => {
  console.error('Ошибка подключения к MongoDB:', error);
});

db.once('open', () => {
  console.log(`Подключено к MongoDB! MONGO_URL = ${MONGO_URL}`);
});

app.use(authMiddleware, (req, res) => {
  if (res.headersSent === false) throw new NotFound('Не удалось обнаружить');
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

function listenServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

listenServer();
