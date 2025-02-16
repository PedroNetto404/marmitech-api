const ApiError = require('../../errors/api-error');
const objectUtils = require('../../utils/object-utils');
const Role = require('../users/enums/role');
const userRepository = require('../users/user-repository');
const customerRepository = require('./customer-repository');

module.exports.create = async ({
  payload,
  auth
}) => {
  const user = await userRepository.findById(auth.id);
  if (!user) {
    ApiError.notFound('Usuário não encontrado');
  }

  if (user.role !== Role.CUSTOMER) {
    ApiError.forbidden('Usuário não autorizado');
  }

  const alreadyExists = await customerRepository.exists({
    cpf: payload.cpf
  });
  if (alreadyExists) {
    ApiError.badRequest('Cliente já cadastrado');
  }

  const customer = {
    ...payload,
    userId: auth.id
  };

  await customerRepository.create({
    payload: customer
  });

  delete customer.userId;

  return customer;
};
  
module.exports.update = async ({
  id,
  payload
}) => {
  const customer = await customerRepository.findById(id);
  if (!customer) {
    ApiError.notFound('Cliente não encontrado');
  }

  const updated = objectUtils.merge({
    original: customer,
    partial: payload
  });

  await customerRepository.update({
    id,
    payload: updated
  });

  return updated;
};

module.exports.remove = async ({
  id
}) => {
  const customer = await customerRepository.findById(id);
  if (!customer) {
    ApiError.notFound('Cliente não encontrado');
  }

  await customerRepository.delete(id);
};

module.exports.findAll = async query => {
  return customerRepository.findAll(query);
};

module.exports.findById = async id => {
  const customer = await customerRepository.findById(id);
  if (!customer) {
    ApiError.notFound('Cliente não encontrado');
  }

  return customer;
};
