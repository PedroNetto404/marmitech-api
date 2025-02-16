const db = require('../../../config/database');
const { DataTypes } = require('sequelize');

const Category = db.sequelize.define('Category', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  logoUrl: { type: DataTypes.STRING },
  priority: { type: DataTypes.INTEGER, defaultValue: 0 },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
});

// @ts-ignore
Category.setup = ({ Product }) => {
  Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products',
  });

  Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
  });

  Category.beforeFind((options) => {
    options.attributes = {
      exclude: ['restaurantId', 'deletedAt', 'updatedAt', 'createdAt'],
    };
  });
}

module.exports = Category;
