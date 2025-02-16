const db = require('../../../config/database');
const { DataTypes } = require('sequelize');
const DishType = require('./enums/dish-type');

const DishModel = db.sequelize.define('Dish', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM(...DishType.values), allowNull: false },
});

module.exports = DishModel;
