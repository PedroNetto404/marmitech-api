const z = require('zod');
const Role = require('./enums/role');

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}$/;

module.exports.FindById = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports.FindAll = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .default('10')
      .transform(Number)
      .refine((value) => value >= 0 && value <= 100, {
        message: 'limit must be between 0 and 100',
      }),
    offset: z
      .string()
      .optional()
      .default('0')
      .transform(Number)
      .refine((value) => value >= 0, {
        message: 'offset must be greater than or equal to 0',
      }),
    sort: z
      .string()
      .optional()
      .default('id:asc')
      .transform((value) => {
        const [field, order] = value.split(':');
        return { field, order };
      })
      .refine(({ order }) => ['asc', 'desc'].includes(order), {
        message: 'sort order must be "asc" or "desc"',
      })
      .refine(
        ({ field }) =>
          ['id', 'username', 'email', 'phone', 'role'].includes(field),
        {
          message:
            'sort field must be "id", "username", "email", "phone" or "role"',
        },
      ),
  }),
});

module.exports.Create = z.object({
  body: z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    phone: z
      .string()
      .length(11)
      .regex(/^[0-9]+$/),
    password: z.string().regex(passwordPattern),
    role: z.enum(Object.values(Role)),
  }),
});

module.exports.Remove = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports.Authenticate = z.object({
  body: z.object({
    identifier: z.string(),
    password: z.string(),
  }),
});
