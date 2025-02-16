import { RequestHandler } from 'express';
import { UserBusiness } from './user-business';
import { FindAllParams, FindAllResult } from '../../utils/generic-repository';
import {
  AuthPayload as AuthPayload,
  CreateUserPayload,
  User,
  UserDto,
} from './user-schema';
import { UserModel } from './user-model';
import { SignResult } from '../../services/jwt-service';

export class UserController {
  private readonly userBusiness = new UserBusiness();

  findById: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const user = await this.userBusiness.findById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  findAll: RequestHandler<
    void,
    FindAllResult<UserDto>,
    void,
    FindAllParams<User, UserModel>
  > = async (req, res, next) => {
    try {
      const users = await this.userBusiness.findAll({
        limit: req.query.limit,
        offset: req.query.offset,
        sort: req.query.sort,
      });

      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  create: RequestHandler<{}, UserDto, CreateUserPayload> = async (
    req,
    res,
    next,
  ) => {
    try {
      const user = await this.userBusiness.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  remove: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      await this.userBusiness.remove(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  authenticate: RequestHandler<{}, SignResult, AuthPayload> = async (
    req,
    res,
    next,
  ) => {
    try {
      const token = await this.userBusiness.auth(req.body);
      res.json(token);
    } catch (error) {
      next(error);
    }
  };

  updateProfilePicture: RequestHandler<{ id: string }, UserDto> = async (req, res, next) => {
    try {
      const user = await this.userBusiness.updateProfilePicture(req.params.id, req.file);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
