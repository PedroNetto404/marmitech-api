const { z } = require('zod');
const ProductType = require('./enums/product-type');
const { Op } = require('sequelize');
const schemaBuilder = require('../../utils/schema-builder');

module.exports.FindByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports.FindAllSchema = schemaBuilder
  .query()
  .sort(['name'])
  .filter([
    {
      name: 'name',
      operators: ['eq', 'iLike'],
      builder: ({ operator, value }) => {
        if (operator === 'iLike') {
          return { name: { [Op.iLike]: `%${value}%` } };
        }
        return { name: { [Op[operator]]: value } };
      },
    },
    {
      name: 'type',
      operators: ['eq'],
      builder: ({ operator, value }) => {
        return {
          type: { [operator]: value },
        };
      },
    },
    {
      name: 'categoryId',
      operators: ['eq'],
      builder: ({ operator, value }) => {
        return {
          category: {
            id: { [operator]: value },
          },
        };
      },
    },
  ])
  .paginate()
  .build();

module.exports.CreateSchema = z.object({
  body: z
    .object({
      name: z.string().min(3),
      description: z.string().min(3),
      price: z.number().positive(),
      category: z
        .object({
          id: z.string().uuid(),
        })
        .optional(),
      costPrice: z.number().positive().optional(),
      stock: z.number().int().positive().optional(),
      packageStock: z.number().int().positive().optional(),
      meatPortion: z.number().int().positive().optional(),
      accompanimentPortion: z.number().int().positive().optional(),
      garnishPortion: z.number().int().positive().optional(),
      saladIncluded: z.boolean().optional(),
      dessertIncluded: z.boolean().optional(),
      packagingCost: z.number().positive().optional(),
      weightPrice: z.number().positive().optional(),
      // @ts-ignore
      type: z.enum([...ProductType.values()]),
    })
    .refine((data) => {
      if (data.costPrice && data.costPrice >= data.price) {
        return 'O preço de custo deve ser menor que o preço';
      }

      if (data.type === ProductType.WITH_CATEGORY && !data.category) {
        return 'A categoria é obrigatória para produtos com categoria';
      }

      if (
        data.type === ProductType.MOUNTED_PLATE &&
        [
          'meatPortion',
          'garnishPortion',
          'saladIncluded',
          'dessertIncluded',
        ].some((key) => !data[key])
      ) {
        return 'Para criar um produto do tipo "marmita" ou "prato feio" é preciso informar a quantidade de porções de proteína, guarnição e se a salada e sobremesa estão inclusas';
      }

      if (data.type === ProductType.PLATE_BY_WEIGHT && !data.weightPrice) {
        return 'O preço por quilo é obrigatório para produtos por quilo';
      }

      return true;
    }),
});

module.exports.UpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: this.CreateSchema.shape.body.innerType().omit({ type: true }),
});

module.exports.UpdateImageSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  file: z.object({
    mimetype: z.string().regex(/^image\/.+/),
    body: z.any(),
  }),
});

module.exports.RemoveSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
