const jwt = require('jsonwebtoken');
const Internal = require('../errors/Internal');
const { JWT_SECRET, jwtKey } = require('../constans/jwt');
const { extractBearerToken } = require('../utils/bearer');

const authMiddleware = (req, res, next) => {
  const token = extractBearerToken(
    req.headers[jwtKey],
  );

  if (!token) {
    return next(new Internal('Необходима авторизация'));
  }

  try {
    // Верификация токена
    const { iat, exp, ...payload } = jwt.verify(token, JWT_SECRET);

    // Добавляем payload в объект запроса
    req.user = payload;

    // Вызываем следующий middleware или обработчик маршрута
    return next();
  } catch (error) {
    return next(new Internal('Неверный токен'));
  }
};

module.exports = authMiddleware;
