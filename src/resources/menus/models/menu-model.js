const db = require('../../../../config/database');
const { DataTypes } = require('sequelize');

const MenuModel = db.sequelize.define('Menu', {
  id: { type: DataTypes.UUID, primaryKey: true },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
});

// @ts-ignore
MenuModel.setup = ({ DishModel, DishesOnMenuModel, Restaurant }) => {
  MenuModel.hasMany(DishesOnMenuModel, { foreignKey: 'menuId' });
  DishesOnMenuModel.belongsTo(MenuModel, { foreignKey: 'menuId' });

  DishesOnMenuModel.belongsTo(DishModel, { foreignKey: 'dishId', as: 'dish' });
  DishModel.hasMany(DishesOnMenuModel, {
    foreignKey: 'dishId',
    as: 'dishesOnMenu',
  });

  Restaurant.hasMany(MenuModel, { foreignKey: 'restaurantId', as: 'menus' });
  MenuModel.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
  });

  MenuModel.beforeFind((options) => {
    options.include = [
      {
        model: DishesOnMenuModel,
        as: 'dishes',
        include: [
          {
            model: DishModel,
            as: 'dish',
            where: {
              restaurantId: db.sequelize.col('Menu.restaurantId'),
            },
          },
        ],
      },
    ];
  });
};

module.exports = MenuModel;
