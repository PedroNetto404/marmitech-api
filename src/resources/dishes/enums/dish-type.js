const enumFactory = require('../../../utils/enum-factory');

const DishType = enumFactory.create({
  /**
   *  Proteína animal.
   */
  MEAT: 'meat',
  /**
   *  acompanhamento.
   */
  ACCOMPANIMENT: 'accompaniment',
  /**
   * Guarnição.
   */
  GARNISH: 'garnish',
});

module.exports = DishType;
