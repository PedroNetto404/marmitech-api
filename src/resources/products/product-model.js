const db = require('../../../config/database');
const ProductType = require('./enums/product-type');
const { DataTypes } = require('sequelize');

const ProductModel = db.sequelize.define('Product', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: { min: 0 },
  },
  categoryId: { type: DataTypes.UUID, allowNull: true },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
    validate: { min: 0 },
  },
  packageStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
    validate: { min: 0 },
  },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
  meatPortion: { type: DataTypes.INTEGER, allowNull: true },
  garnishPortion: { type: DataTypes.INTEGER, allowNull: true },
  saladIncluded: { type: DataTypes.BOOLEAN, defaultValue: true },
  dessertIncluded: { type: DataTypes.BOOLEAN, defaultValue: true },
  packagingCost: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  weightPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  type: { type: DataTypes.ENUM(...ProductType.values()), allowNull: false },
});

// @ts-ignore
ProductModel.setup = ({ Category, Restaurant }) => {
  ProductModel.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
  });

  Category.hasMany(ProductModel, {
    foreignKey: 'categoryId',
    as: 'products',
  });

  ProductModel.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
  });

  ProductModel.beforeFind((options) => {
    options.include = [
      {
        association: 'category',
        attributes: {
          include: ['id', 'name'],
        }
      },
      {
        association: 'restaurant',
        attributes: {
          include: ['id', 'tradeName'],
        }
      },
    ];

    options.attributes = {
      exclude: ['categoryId', 'restaurantId', 'deletedAt', 'updatedAt', 'createdAt'],
    };
  });
};

module.exports = ProductModel;
