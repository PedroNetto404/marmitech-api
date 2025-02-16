import { Router } from 'express';
import { UserController } from './user-controller';
import { validate } from '../../middlewares/validate';    
import { authenticate } from '../../middlewares/authenticate';
import { UserSchema } from './user-schema';

const controller = new UserController();
const router = Router();

router.get('/', validate(UserSchema.FindAll), controller.findAll);
router.get('/:id', validate(UserSchema.FindById), controller.findById);
router.post('/', validate(UserSchema.Create), controller.create);
router.delete('/:id', validate(UserSchema.Remove), controller.remove);
router.post('/auth', validate(UserSchema.Auth), controller.authenticate);

export const userRouter = Router();
userRouter.use('/users', authenticate, router);
