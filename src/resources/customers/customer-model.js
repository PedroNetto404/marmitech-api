const db = require('../../../config/database');
const { DataTypes } = require('sequelize');

const CustomerModel = db.sequelize.define('Customer', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: false },
  adddressId: { type: DataTypes.UUID, allowNull: false },
}, { paranoid: true, timestamps: true });

// @ts-ignore
CustomerModel.setup = ({ Address }) => {
  CustomerModel.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address',
  });

  Address.hasOne(CustomerModel, {
    foreignKey: 'addressId',
    as: 'customer',
  });

  CustomerModel.beforeFind((options) => {
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
      exclude: ['addressId', 'deletedAt', 'updatedAt', 'createdAt'],
    };
  });
}

module.exports = CustomerModel;
