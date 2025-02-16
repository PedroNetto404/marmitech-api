const db = require('../../../../config/database');
const { DataTypes } = require('sequelize');
const OrderStatus = require('../enums/order-status');

const OrderModel = db.sequelize.define(
  'Order',
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    customerId: { type: DataTypes.UUID, allowNull: false },
    restaurantId: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.ENUM(...OrderStatus.values) },
    confirmedAt: { type: DataTypes.DATE },
    deliveredAt: { type: DataTypes.DATE },
    canceledAt: { type: DataTypes.DATE },
  },
  { timestamps: true, paranoid: true },
);

// @ts-ignore
OrderModel.setup = ({
  Customer,
  Restaurant,
  OrderItem,
  Product,
  SelectedDish,
  DishesOnMenuModel
}) => {
  Customer.hasMany(OrderModel, { foreignKey: 'customerId', as: 'orders' });
  OrderModel.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

  Restaurant.hasMany(OrderModel, { foreignKey: 'restaurantId', as: 'orders' });
  OrderModel.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
  });

  OrderModel.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(OrderModel, { foreignKey: 'orderId', as: 'order' });

  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'items' });

  OrderItem.hasMany(SelectedDish, {
    foreignKey: 'orderItemId',
    as: 'selectedDishes',
  });
  SelectedDish.belongsTo(OrderItem, {
    foreignKey: 'orderItemId',
    as: 'orderItem',
  });

  SelectedDish.belongsTo(DishesOnMenuModel, {
    foreignKey: 'dishOnMenuId',
    as: 'dishOnMenu',
  });
  DishesOnMenuModel.hasMany(SelectedDish, {
    foreignKey: 'dishOnMenuId',
    as: 'selectedDishes',
  });



  OrderModel.beforeFind(options => {
    options.include = [
      {
        model: OrderItem,
        as: 'items',
        attributes: {
          exclude: ['orderId', 'id'],
        },
        where: {
          orderId: db.sequelize.col('Order.id'),
        },
        include: [
          {
            model: SelectedDish,
            as: 'selectedDishes',
            attributes: {
              exclude: ['orderItemId', 'id'],
            },
            where: {
              orderItemId: db.sequelize.col('OrderItem.id'),
            }
          }
        ]
      }
    ]
  })
};

module.exports = OrderModel;
