const db = require('../../../../config/database');
const { DataTypes } = require('sequelize');

const SelectedDishModel = db.sequelize.define('SelectedDish', {
  id: { type: DataTypes.UUID, primaryKey: true },
  dishOnMenuId: { type: DataTypes.UUID, allowNull: false },
  orderItemId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  isAdditional: { type: DataTypes.BOOLEAN, allowNull: false },
});

module.exports = SelectedDishModel;
