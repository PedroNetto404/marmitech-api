const { Router } = require('express');
const env = require('../../config/env');

const userRouter = require('../resources/users/user-router');

const router = Router();
router.use(userRouter);

const apiRouter = Router();
apiRouter.use(env.api.prefix, router);
module.exports = apiRouter;
