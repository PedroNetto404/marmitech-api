const db = require('../../../../config/database');
const { DataTypes } = require('sequelize');

const DishesOnMenuModel = db.sequelize.define('DishesOnMenu', {
  id: { type: DataTypes.UUID, primaryKey: true },
  dishId: { type: DataTypes.UUID, allowNull: false },
  menuId: { type: DataTypes.UUID, allowNull: false },
  enabled: { type: DataTypes.BOOLEAN, allowNull: false },
  canBeUsedAsAdditional: { type: DataTypes.BOOLEAN, allowNull: false },
  additionalPrice: { type: DataTypes.DECIMAL, allowNull: false },
  order: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = DishesOnMenuModel;
