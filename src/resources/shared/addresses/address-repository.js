const AddressModel = require('./address-model');

/**
 *  @param {{
 *  payload: object;
 *  transaction: import('sequelize').Transaction;
 * }} params
 */
module.exports.create = async ({ payload, transaction }) => {
  return AddressModel.create(payload, { transaction, returning: false });
};

/**
 *
 * @param {{
 *  id: string;
 *  payload: object;
 *  transaction: import('sequelize').Transaction;
 * }} params
 */
module.exports.update = async ({ id, payload, transaction }) => {
  return AddressModel.update(payload, { where: { id }, transaction });
};
