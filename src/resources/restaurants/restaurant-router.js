const authenticate = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  findAll,
  findById,
  remove,
  create,
  update
} = require('./restaurant-controller');
const {
  CreateSchema,
  UpdateSchema,
  FindAllSchema,
  FindByIdSchema,
  RemoveSchema
} = require('./restaurant-schema'); 
const { Router } = require('express');

const router = Router();

router.post('/', validate(CreateSchema), create);
router.get('/', validate(FindAllSchema), findAll);
router.get('/:id', validate(FindByIdSchema), findById);
router.put('/:id', validate(UpdateSchema), update);
router.delete('/:id', validate(RemoveSchema), remove);

const restaurantRouter = Router();
router.use('/restaurants', authenticate, router);
module.exports = restaurantRouter;
