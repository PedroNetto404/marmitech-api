const { z } = require('zod');
const AddressSchema = require('../shared/addresses/address-schema');
const schemaBuilder = require('../../utils/schema-builder');
const { Op } = require('sequelize');

const CreateSchema = z.object({
  body: z
    .object({
      name: z.string().min(3).max(255),
      cpf: z.string().length(11),
      address: AddressSchema,
    })
    .strict(),
});

const UpdateSchema = schemaBuilder.params().extend({
  body: CreateSchema.shape.body.partial(),
});

const FindAllSchema = schemaBuilder
  .query()
  .filter([
    {
      name: 'name',
      operators: ['eq', 'iLike', 'substring', 'startsWith', 'endsWith'],
      builder: ({ operator, value }) => {
        if (operator === 'iLike') {
          return { name: { [Op.iLike]: `%${value}%` } };
        }

        return { name: { [Op[operator]]: value } };
      },
    },
    {
      name: 'cpf',
      operators: ['eq'],
      builder: ({ value }) => ({ cpf: value }),
    },
  ])
  .paginate()
  .sort(['name'])
  .build();

const RemoveSchema = schemaBuilder.params();

const FindByIdSchema = schemaBuilder.params();

const CustomerSchema = {
  CreateSchema,
  UpdateSchema,
  RemoveSchema,
  FindAllSchema,
  FindByIdSchema,
};

module.exports = CustomerSchema;
