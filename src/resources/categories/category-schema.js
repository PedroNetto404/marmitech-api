const z = require('zod');

module.exports.FindById = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports.FindAll = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .default('10')
      .transform((v) => parseInt(v, 10)),
    offset: z
      .string()
      .optional()
      .default('0')
      .transform((v) => parseInt(v, 10)),
    sort: z
      .string()
      .optional()
      .default('name')
      .transform((v) => v.split(':'))
      .transform(([field, order]) => ({ field, order }))
      .refine((v) => ['asc', 'desc'].includes(v.order), {
        message: 'Invalid sort order',
      })
      .refine((v) => ['name', 'priority'].includes(v.field), {
        message: 'Invalid sort field',
      }),
    name: z.string().optional(),
  }),
});

module.exports.Create = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    description: z.string().max(255),
    priority: z.number().int().min(0).max(100),
  }),
});

module.exports.Update = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: this.Create.shape.body,
});

module.exports.Remove = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
