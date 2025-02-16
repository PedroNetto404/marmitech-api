const db = require('../../../../config/database');
const { DataTypes } = require('sequelize');

const OrderItemModel = db.sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  weight: { type: DataTypes.DECIMAL, allowNull: true },
  observation: { type: DataTypes.STRING, allowNull: true },
});

module.exports = OrderItemModel;
