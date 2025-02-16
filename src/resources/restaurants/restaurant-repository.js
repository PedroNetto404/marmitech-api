const genericRepositoryFactory = require('../../utils/generic-repository');
const RestaurantModel = require('./restaurant-model');
const addressRepository = require('../shared/addresses/address-repository');
const db = require('../../../config/database');

const restaurantRepository = {
  ...genericRepositoryFactory.withModel(RestaurantModel).build(),
  /**
   *
   * @param {any} restaurant
   */
  async create(restaurant) {
    const t = await db.sequelize.transaction();

    try {
      await addressRepository.create({
        payload: restaurant.address,
        transaction: t,
      });

      await RestaurantModel.create(
        { ...restaurant, addressId: restaurant.address.id },
        { transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
  /**
   *
   * @param {string} id
   * @param {any} restaurant
   */
  async update(id, restaurant) {
    const t = await db.sequelize.transaction();

    try {
      await addressRepository.update({
        id: restaurant.address.id,
        payload: restaurant.address,
        transaction: t,
      });

      await RestaurantModel.update(
        { ...restaurant, addressId: restaurant.address.id },
        { where: { id }, transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};
module.exports = restaurantRepository;
