const db = require('../../../config/database');
const { DataTypes } = require('sequelize');

const RestaurantModel = db.sequelize.define(
  'Restaurant',
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    legalName: { type: DataTypes.STRING, allowNull: false },
    tradeName: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: false },
    addressId: { type: DataTypes.UUID, allowNull: false },
    showCnpjInReceipt: { type: DataTypes.BOOLEAN, allowNull: false },
    automaticAcceptOrder: { type: DataTypes.BOOLEAN, allowNull: false },
    maximumOrderRadius: { type: DataTypes.DECIMAL, allowNull: false },
    freeDeliveryFeeRadius: { type: DataTypes.DECIMAL, allowNull: false },
    deliveryFeePerKm: { type: DataTypes.DECIMAL, allowNull: false },
    minimumOrderValue: { type: DataTypes.DECIMAL, allowNull: false },
    ownerId: { type: DataTypes.UUID, allowNull: false },
  },
  { paranoid: true, timestamps: true },
);

// @ts-ignore
RestaurantModel.setup = ({ Address, User }) => {
  RestaurantModel.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address',
  });

  Address.hasOne(RestaurantModel, {
    foreignKey: 'addressId',
    as: 'restaurant',
  });

  RestaurantModel.beforeFind((options) => {
    options.include = [
      {
        model: Address,
        as: 'address',
        attributes: {
          exclude: ['id'],
        },
      },
    ];

    options.attributes = {
      exclude: ['addressId', 'ownerId', 'deletedAt', 'updatedAt', 'createdAt'],
    };
  });

  RestaurantModel.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner',
  });

  User.hasMany(RestaurantModel, {
    foreignKey: 'ownerId',
    as: 'restaurants',
  });
};

module.exports = RestaurantModel;
