const uuid = require('uuid');
const _ = require('lodash');
const jwtService = require('../../services/jwt-service');
const hashService = require('../../services/hash-service');

const userRepository = require('./user-repository');
const ApiError = require('../../errors/api-error');

const toDto = (user) =>
  _.omit(user, ['password', 'createdAt', 'updatedAt', 'deletedAt']);

module.exports.findById = async (id) => {
  const user = await userRepository.findById(id);
  return toDto(user);
};

module.exports.findAll = async (params) => {
  return await userRepository.findAll(params).then(({ records, meta }) => ({
    records: records.map(toDto),
    meta,
  }));
};

module.exports.create = async (payload) => {
  if (
    await userRepository.exists({
      email: payload.email,
      phone: payload.phone,
      username: payload.username,
    })
  ) {
    throw ApiError.conflict('User already exists');
  }

  const user = {
    ...payload,
    id: uuid.v4(),
    password: await hashService.hash(payload.password),
  };

  await userRepository.create(user);

  return _.omit(user, ['password']);
};

module.exports.remove = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await userRepository.delete(id);
};

module.exports.authenticate = async ({ identifier, password }) => {
  const user = await userRepository.findBy({
    email: identifier,
    phone: identifier,
    username: identifier,
  });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const passMatch = await hashService.compare(password, user.password);
  if (!passMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  return jwtService.sign({ ...toDto(user) });
};
