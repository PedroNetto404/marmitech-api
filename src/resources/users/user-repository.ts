import { Op } from 'sequelize';
import { GenericRepository } from '../../utils/generic-repository';
import { UserModel } from './user-model';
import { User } from './user-schema';

export class UserRepository extends GenericRepository<User, UserModel> {
  constructor() {
    super(UserModel);
  }

  async findBy({
    email,
    phone,
    username,
  }: {
    email: string;
    phone: string;
    username: string;
  }): Promise<User | null> {
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ email }, { phone }, { username }],
      },
    });
    return user ? (user.toJSON() as User) : null;
  }
}
