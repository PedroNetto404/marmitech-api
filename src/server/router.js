const { Router } = require('express');
const env = require('../../config/env');
const userRouter = require('../resources/users/user-router');
const categoryRouter = require('../resources/categories/category-router');
const restaurantRouter = require('../resources/restaurants/restaurant-router');
const productRouter = require('../resources/products/product-router');
const customerRouter = require('../resources/customers/customer-router');

const router = Router();
router.use(userRouter);
router.use(categoryRouter);
router.use(restaurantRouter);
router.use(productRouter);
router.use(customerRouter);

const apiRouter = Router();
apiRouter.use(env.api.prefix, router);

module.exports = apiRouter;
