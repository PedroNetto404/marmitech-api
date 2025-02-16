const genericRepositoryFactory = require('../../utils/generic-repository');
const OrderModel = require('./models/order-model');
const OrderItemModel = require('./models/order-item-model');
const SelectedDishModel = require('./models/selected-dish-model');
const db = require('../../../config/database');
const { v4: uuidv4 } = require('uuid');

const OrderRepository = {
  ...genericRepositoryFactory.withModel(OrderModel).build(),
  async create({ payload }) {
    const t = await db.sequelize.transaction();

    try {
      await OrderModel.create(payload, {
        transaction: t,
        returning: false,
      });

      await OrderItemModel.bulkCreate(payload.OrderItems, {
        transaction: t,
        returning: false,
      });

      await SelectedDishModel.bulkCreate(
        payload.OrderItems.flatMap((item) =>
          item.selectedDishes.map((dish) => ({
            ...dish,
            orderItemId: item.id,
          })),
        ),
        {
          transaction: t,
          returning: false,
        },
      );
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async update({ id, payload }) {
    const t = await db.sequelize.transaction();

    try {
      await OrderModel.update(payload, {
        where: { id },
        transaction: t,
      });

      for (const item of payload.OrderItems) {
        item.id = item.id || uuidv4();

        await OrderItemModel.upsert(
          { ...item, orderId: id },
          {
            transaction: t,
            conflictFields: ['id'],
          },
        );
      }

      for (const item of payload.OrderItems) {
        for (const dish of item.selectedDishes) {
          dish.id = dish.id || uuidv4();
          dish.orderItemId = item.id;

          await SelectedDishModel.upsert(dish, {
            transaction: t,
            conflictFields: ['id'],
          });
        }
      }
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};

module.exports = OrderRepository;
