const moment = require('moment');
const genericRepositoryFactory = require('../../utils/generic-repository');
const MenuModel = require('./models/menu-model');

const menuRepository = {
  ...genericRepositoryFactory.withModel(MenuModel).build(),
  /**
   *
   * @returns {Promise<{
   *  id: string;
   *  restaurantId: string;
   *  date: string;
   *  dishes: {
   *    id: string;
   *    enabled: boolean;
   *    canBeUsedAsAdditional: boolean;
   *    additionalPrice: number;
   *    order: number;
   *    dish: {
   *     id: string;
   *     name: string;
   *     description: string;
   *     imageUrl: string;
   *     restaurantId: string;
   *     type: string;
   *    }
   * }[];
   * }>}
   */
  async getCurrent({ restaurantId }) {
    const today = moment().format('YYYY-MM-DD');

    return this.findOne({
      date: today,
      restaurantId,
    });
  },
};

module.exports = menuRepository;
