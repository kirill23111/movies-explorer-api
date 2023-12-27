const bcrypt = require('bcrypt');
const { generateJwtToken } = require('../constans/jwt');
const User = require('../models/user'); // Путь к файлу с моделью пользователя
const {
  SUCCESS, CREATED,
} = require('../constans/codes');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Internal = require('../errors/Internal');
const Conflict = require('../errors/Conflict');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const createUser = async (registrationUserDto) => {
  const {
    name,
    email,
    password,
  } = registrationUserDto;
    // Хеширование пароля перед сохранением в базу
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

const updateProfile = (req, res, next) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFound('Запрашиваемый ресурс не найден. Пользователя не существует.');
      }
      return res
        .status(SUCCESS)
        .send({
          name: user.name,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Данный email уже занят'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Ошибка при обработке запроса. Пожалуйста, проверьте введенные данные.'));
      }
      return next(err);
    });
};

const getFormattedUser = (user) => {
  const jsonUser = JSON.parse(JSON.stringify(user));

  return {
    _id: jsonUser._id,
    name: jsonUser.name,
    email: jsonUser.email,
    password: jsonUser.password,
  };
};

const registration = async (req, res, next) => {
  try {
    const createdUser = await createUser(req.body);
    const { password, ...formatedCreatedUser } = getFormattedUser(createdUser);

    return res.status(CREATED).json(formatedCreatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return next(new Conflict(`Пользователь с таким Email ${error.keyValue.email} уже существует`));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequest('Ошибка при обработке запроса. Пожалуйста, проверьте введенные данные.'));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя по email
    const user = await User.findOne({ email }).select('+password');

    // Проверяем, найден ли пользователь
    if (user === null) {
      return next(new Conflict(`Пользователя с email ${email} не существует`));
    }

    // Проверяем, совпадает ли пароль
    const passwordResult = bcrypt.compareSync(password, user.password);

    if (passwordResult === false) throw new Internal('Неправильный пароль');

    const jwtToken = generateJwtToken({
      id: user.id,
      email,
    });

    return res
      .send({ token: jwtToken });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequest('Ошибка при обработке запроса. Пожалуйста, проверьте введенные данные.'));
    }
    return next(error);
  }
};

module.exports = {
  getUsers,
  login,
  registration,
  updateProfile,
};
