const UserModel = require('./user-model');
const { Op } = require('sequelize');
const { findAll } = require('../../utils/query-utils');

module.exports.findById = async (id) => {
  const user = await UserModel.findByPk(id);
  return user.toJSON();
};

module.exports.findBy = async ({ email, phone, username }) => {
  const user = await UserModel.findOne({
    where: {
      [Op.or]: [{ email }, { phone }, { username }],
    },
  });

  return user?.toJSON();
};

module.exports.findAll = async (params) => findAll(UserModel, params);

module.exports.exists = async ({ email, phone, username }) => {
  const count = await UserModel.count({
    where: {
      [Op.or]: [{ email }, { phone }, { username }],
    },
  });

  return count > 0;
};

module.exports.create = async (user) => {
  await UserModel.create(user, {
    returning: false,
  });
};

module.exports.update = async (user) => {
  await UserModel.update(user, {
    where: { id: user.id },
    returning: false,
  });
}

module.exports.remove = async (id) => {
  await UserModel.destroy({
    where: { id },
  });
};
