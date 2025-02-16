import { FindAllParams } from '../../utils/generic-repository';
import { UserModel } from './user-model';
import { AuthPayload, CreateUserPayload, User, UserDto } from './user-schema';
import { UserRepository } from './user-repository';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { hashService } from '../../services/hash-service';
import ApiError from '../../errors/api-error';
import { jwtService } from '../../services/jwt-service';
import { ObjectStorageService } from '../../services/object-storage-service';
import { env } from '../../../config/env';

export class UserBusiness {
  private readonly userRepository: UserRepository = new UserRepository();
  private readonly objectStorageService: ObjectStorageService = new ObjectStorageService();

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return UserBusiness.toDto(user);
  }

  async findAll(params: FindAllParams<User, UserModel>) {
    const { meta, records } = await this.userRepository.findAll(params);

    return {
      meta,
      records: records.map(UserBusiness.toDto),
    };
  }

  async create(payload: CreateUserPayload) {
    if (
      await this.userRepository.exists({
        email: payload.email,
        phone: payload.phone,
        username: payload.username,
      })
    ) {
      throw ApiError.conflict('User already exists');
    }

    const user: User = {
      ...payload,
      id: uuid.v4(),
      hashedPassword: await hashService.hash(payload.password),
    };

    await this.userRepository.create({
      payload: user,
    });

    return UserBusiness.toDto(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await this.userRepository.delete({
      id,
    });
  }

  async auth({ identifier, password }: AuthPayload) {
    const user = await this.userRepository.findBy({
      email: identifier,
      phone: identifier,
      username: identifier,
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const passMatch = await hashService.compare({
      value: password,
      hash: user.hashedPassword,
    });

    if (!passMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    return jwtService.sign(UserBusiness.toDto(user));
  }

  async updateProfilePicture({
    userId,
    file,
  }: {
      userId: string;
      file: {
        buffer: Buffer;
        mimetype: string;
      };
    }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const key = `USER_${userId}_PROFILE_PICTURE.${file.mimetype.split('/')[1]}`;
    await this.objectStorageService.upload({
      key,
      file: file.buffer,
      bucket: 'users',
    });

    user.profilePictureUrl = `${env.staticFilesUrl}?key=${key}`;
    await this.userRepository.update({
      id: userId,
      payload: user,
    });

    return UserBusiness.toDto(user);
  }

  private static toDto(user: User): UserDto {
    return _.omit(user, ['hashedPassword']);
  }
}
