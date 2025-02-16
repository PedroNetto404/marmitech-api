const { Router } = require('express');
const customerController = require('./customer-controller');
const customerSchema = require('./customer-schema');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');

const router = Router();

router.post('/', validate(customerSchema.create), customerController.create);
router.put('/:id', validate(customerSchema.update), customerController.update);
router.delete(
  '/:id',
  validate(customerSchema.remove),
  customerController.remove,
);
router.get('/', validate(customerSchema.findAll), customerController.findAll);
router.get(
  '/:id',
  validate(customerSchema.findById),
  customerController.findById,
);

const customerRouter = Router();

customerRouter.use('/customers', authenticate, router);

module.exports = customerRouter;
