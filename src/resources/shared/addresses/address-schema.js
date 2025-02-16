const { z } = require('zod');

const AddressSchema = z.object({
  street: z.string().min(3).max(255),
  number: z.string().regex(/^\d+$/),
  neighborhood: z.string().min(3).max(255),
  city: z.string().min(3).max(255),
  state: z.string().length(2),
  country: z.string().min(3).max(255),
  zipCode: z.string().regex(/^\d{8}$/),
  longitude: z.number(),
  latitude: z.number(),
});

module.exports = AddressSchema;


