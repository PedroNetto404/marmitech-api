import { DataTypes, Model } from 'sequelize';
import { db } from '../../../config/database';
import Role from './enums/role';
import { User } from './user-schema';

export class UserModel extends Model<User> {}
UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
    },
    profilePictureUrl: {
      type: DataTypes.STRING(200),
    },
  },
  {
    sequelize: db.sequelize,
    modelName: 'User',
  },
);
