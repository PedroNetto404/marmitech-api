const { z } = require('zod');
const schemaBuilder = require('../../utils/schema-builder');
const { Op } = require('sequelize');
const AddressSchema = require('../shared/addresses/address-schema');

const CreateSchema = z.object({
  body: z.object({
    legalName: z.string().min(3).max(255),
    tradeName: z.string().min(3).max(255),
    cnpj: z.string().length(14),
    showCnpjInReceipt: z.boolean(),
    automaticAcceptOrder: z.boolean(),
    maximumOrderRadius: z.number().min(0),
    freeDeliveryFeeRadius: z.number().min(0),
    deliveryFeePerKm: z.number().min(0),
    minimumOrderValue: z.number().min(0),
    address: AddressSchema,
  }),
});

const UpdateSchema = schemaBuilder.params().extend({
  body: CreateSchema.shape.body,
});

const FindAllSchema = schemaBuilder
  .query()
  .paginate()
  .sort(['legalName'])
  .filter([
    {
      name: 'legalName',
      operators: ['eq', 'iLike'],
      builder: ({ name, operator, value }) => {
        if (operator === 'eq') {
          return { [name]: value };
        }

        return { [name]: { [Op.iLike]: `%${value}%` } };
      },
    },
    {
      name: 'cnpj',
      operators: ['eq'],
      builder: ({ name, value }) => ({ [name]: value }),
    },
  ])
  .build();

const FindByIdSchema = schemaBuilder.params();

const RemoveSchema = schemaBuilder.params();

module.exports = {
  CreateSchema,
  UpdateSchema,
  FindAllSchema,
  FindByIdSchema,
  RemoveSchema,
};
