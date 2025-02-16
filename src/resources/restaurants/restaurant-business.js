const { Op } = require('sequelize');
const ApiError = require('../../errors/api-error');
const Role = require('../users/enums/role');
const userRepository = require('../users/user-repository');
const restaurantRepository = require('./restaurant-repository');
const { v4: uuid } = require('uuid');
const objectUtils = require('../../utils/object-utils');

const create = async ({ payload, auth }) => {
  const user = await userRepository.findById(auth.id);
  if (!user) {
    ApiError.notFound('Usuário não encontrado');
  }

  if (user.role !== Role.RESTAURANT_OWNER) {
    ApiError.forbidden('Usuário não autorizado');
  }

  const alreadyExists = await restaurantRepository.exists({
    [Op.or]: [{ cnpj: payload.cnpj }, { ownerId: auth.id }],
  });
  if (alreadyExists) {
    ApiError.badRequest('Restaurante já cadastrado');
  }

  const restaurant = {
    id: uuid(),
    ...payload,
    ownerId: auth.id,
  };

  await restaurantRepository.create({ restaurant });

  delete restaurant.userId;
  return restaurant;
};

const update = async ({ id, payload }) => {
  const restaurant = await restaurantRepository.findById(id);
  if (!restaurant) {
    ApiError.notFound('Restaurante não encontrado');
  }

  const updated = objectUtils.merge({
    original: restaurant,
    partial: payload,
  });

  await restaurantRepository.update(id, updated);

  return updated;
};

const remove = async ({ id }) => {
  const restaurant = await restaurantRepository.findById(id);
  if (!restaurant) {
    ApiError.notFound('Restaurante não encontrado');
  }

  await restaurantRepository.delete(id);
};

const findAll = async (query) => {
  return restaurantRepository.findAll(query);
};

const findById = async (id) => {
  const restaurant = await restaurantRepository.findById(id);
  if (!restaurant) {
    ApiError.notFound('Restaurante não encontrado');
  }

  return restaurant;
};

module.exports = {
  create,
  update,
  remove,
  findAll,
  findById,
};
