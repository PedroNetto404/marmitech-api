const { Router } = require('express');
const authenticate = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  findAll,
  findById,
  remove,
  create,
  update
} = require('./product-controller');
const {
  CreateSchema,
  UpdateSchema,
  FindAllSchema,
  FindByIdSchema,
  RemoveSchema
} = require('./product-schema');

const router = Router();

router.post('/', validate(CreateSchema), create);
router.get('/', validate(FindAllSchema), findAll);
router.get('/:id', validate(FindByIdSchema), findById);
router.put('/:id', validate(UpdateSchema), update);
router.delete('/:id', validate(RemoveSchema), remove);

const productRouter = Router();
router.use('/products', authenticate, router);
module.exports = productRouter;

