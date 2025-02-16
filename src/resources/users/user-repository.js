const UserModel = require('./user-model');
const genericRepositoryFactory = require('../../utils/generic-repo-factory');
const { Op } = require('sequelize');

const userRepository = {
  ...genericRepositoryFactory.withModel(UserModel).build(),
  findBy: ({ email, phone, username }) =>
    UserModel.findOne({
      where: {
        [Op.or]: [{ email }, { phone }, { username }],
      },
    }).then((user) => user?.toJSON()),
};
module.exports = userRepository;
