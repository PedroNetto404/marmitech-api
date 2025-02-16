const genericRepositoryFactory = require('../../utils/generic-repository');
const CustomerModel = require('./customer-model');
const AddressModel = require('../shared/addresses/address-model');
const db = require('../../../config/database');

const customerRepository = {
  ...genericRepositoryFactory.withModel(CustomerModel).build(),
  create: async ({ payload }) => {
    const t = await db.sequelize.transaction();

    try {
      const address = await AddressModel.create(
        {
          ...payload.address,
        },
        {
          transaction: t,
        },
      ).then((address) => address.toJSON());

      await CustomerModel.create(
        {
          ...payload,
          addressId: address.id,
        },
        {
          transaction: t,
          returning: false,
        },
      );

      await t.commit();

      payload.address = {
        ...address,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
  update: async ({ id, payload }) => {
    const t = await db.sequelize.transaction();

    try {
      await AddressModel.update(
        {
          ...payload.address,
        },
        {
          where: { id: payload.address.id },
          transaction: t,
        },
      );

      await CustomerModel.update(
        {
          ...payload,
          addressId: payload.address.id,
        },
        {
          where: { id },
          transaction: t,
        },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};
module.exports = customerRepository;
