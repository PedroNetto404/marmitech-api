const { Router } = require('express');

const userController = require('./user-controller');
const userSchema = require('./user-schema');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');

const router = Router();

router.get(
  '/',
  authenticate,
  validate(userSchema.FindAll),
  userController.findAll,
);
router.get(
  '/:id',
  authenticate,
  validate(userSchema.FindById),
  userController.findById,
);
router.post('/', validate(userSchema.Create), userController.create);
router.delete('/:id', authenticate, validate(userSchema.Remove), userController.remove);
router.post(
  '/authenticate',
  validate(userSchema.Authenticate),
  userController.authenticate,
);

const userRouter = Router();
userRouter.use('/users', router);
module.exports = userRouter;
