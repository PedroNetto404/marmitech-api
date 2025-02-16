const { Router } = require('express');
const authenticate = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const Schemas = require('./category-schema');
const controller = require('./category-controller');

const router = Router();

router.post('/', authenticate, validate(Schemas.Create), controller.create);
router.get('/', authenticate, validate(Schemas.FindAll), controller.findAll);
router.get('/:id', authenticate, validate(Schemas.FindById), controller.findById);
router.put('/:id', authenticate, validate(Schemas.Update), controller.update);
router.delete('/:id', authenticate, validate(Schemas.Remove), controller.remove);

const categoryRouter = Router();
categoryRouter.use('/categories', router);

module.exports = categoryRouter;
