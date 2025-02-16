import z from 'zod';
import Role from './enums/role';
import schemaBuilder from '../../utils/schema-builder';
import { Op } from 'sequelize';

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}$/;

const User = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  profilePictureUrl: z.string().url().optional(),
  email: z.string().email(),
  phone: z
    .string()
    .length(11)
    .regex(/^[0-9]+$/),
  role: z.nativeEnum(Role),
  hashedPassword: z.string(),
});

export type User = z.infer<typeof User>;

export type UserDto = Omit<User, 'hashedPassword'>;

const FindById = schemaBuilder.params();

const FindAll = schemaBuilder
  .query<User>()
  .paginate()
  .filter({
    field: 'phone',
    operators: ['eq', 'ne'],
    builder: ({ operator, value }) => ({
      ...(operator === 'eq' && { phone: value }),
      ...(operator === 'ne' && {
        phone: {
          [Op.ne]: value,
        },
      }),
    }),
  })
  .filter({
    field: 'email',
    operators: ['eq', 'ne'],
    builder: ({ operator, value }) => ({
      ...(operator === 'eq' && { email: value }),
      ...(operator === 'ne' && {
        email: {
          [Op.ne]: value,
        },
      }),
    }),
  })
  .filter({
    field: 'role',
    operators: ['eq'],
    builder: ({ operator, value }) => ({
      ...(operator === 'eq' && { role: value }),
    }),
  })
  .sort('id')
  .sort('username')
  .sort('email')
  .sort('phone')
  .build();

export type CreateUserPayload = Omit<User, 'id' | 'hashedPassword'> & {
  password: string;
};

const Create = z.object({
  body: User.omit({
    id: true,
    hashedPassword: true,
  }).extend({
    password: z.string().regex(passwordPattern),
  }),
});

const Remove = schemaBuilder.params();

const AuthPayload = z.object({
  identifier: z.string(),
  password: z.string(),
});

export type AuthPayload = z.infer<typeof AuthPayload>;

const Auth = z.object({
  body: AuthPayload,
});

export const UserSchema = {
  FindById,
  FindAll,
  Create,
  Remove,
  Auth: AuthPayload,
};
