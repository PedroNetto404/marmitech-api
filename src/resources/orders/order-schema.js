const { z } = require('zod');
const OrderStatus = require('./enums/order-status');
const schemaBuilder = require('../../utils/schema-builder');

const selectedDisheSchema = z.object({
  dishOnMenuId: z.string().uuid(),
  quantity: z.number().int().positive(),
  isAdditional: z.boolean(),
});

const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  weight: z.number().optional(),
  observation: z.string().optional(),
  selectedDishes: z
    .array(selectedDisheSchema)
    .optional()
    .default(null)
    .refine((value) => {
      if (value) {
        return value.length > 0;
      }

      return true;
    }),
});

const OrderSchema = z.object({
  customerId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  status: z.enum(OrderStatus.values),
  items: z.array(OrderItemSchema),
});

const CreateSchema = z.object({
  body: OrderSchema.omit({ status: true }),
});

const UpdateSchema = schemaBuilder.params().extend({
  body: OrderSchema.partial(),
});

const FindByIdSchema = schemaBuilder.params();

const FindAllSchema = schemaBuilder.query().paginate().build();

const RemoveSchema = schemaBuilder.params();

module.exports = {
  CreateSchema,
  UpdateSchema,
  RemoveSchema,
  FindByIdSchema,
  FindAllSchema,
};

