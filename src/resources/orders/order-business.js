const { Op } = require('sequelize');
const ApiError = require('../../errors/api-error');
const productRepository = require('../products/product-repository');
const userRepository = require('../users/user-repository');
const OrderRepository = require('./order-repository');
const menuRepository = require('../menus/menu-repository');
const { v4: uuid } = require('uuid');
const customerRepository = require('../customers/customer-repository');
const DishType = require('../dishes/enums/dish-type');
const ProductType = require('../products/enums/product-type');

// const calculateMountedPlatePrice = (product, selectedDishes, dishesOnMenu) => {
//   return (
//     product.price +
//     selectedDishes
//       .filter((sd) => sd.isAdditional)
//       .reduce((acc, sd) => {
//         const dish = dishesOnMenu.find((d) => d.dish.id === sd.dishOnMenuId);
//         return acc + dish.price * sd.quantity;
//       }, 0)
//   );
// };

const calculateItemPrice = (product, item, dishesOnMenu) => {
  const basePrice = product.price * item.quantity;

  if (product.type === ProductType.PLATE_BY_WEIGHT) {
    return item.weight * basePrice;
  }

  if (product.type === ProductType.MOUNTED_PLATE) {
    return (
      basePrice +
      item.selectedDishes.reduce((acc, sd) => {
        if (sd.isAdditional) {
          return acc;
        }

        const dish = dishesOnMenu.find((d) => d.dish.id === sd.dishOnMenuId);
        return acc + dish.price * sd.quantity;
      }, 0)
    );
  }

  return basePrice;
};

module.exports.create = async ({ payload, auth }) => {
  const user = await userRepository.findById(auth.id);
  if (!user) {
    ApiError.notFound('Usuário não encontrado');
  }

  const customer = await customerRepository.findById(payload.customerId);
  if (!customer) {
    ApiError.notFound('Cliente não encontrado');
  }

  const {
    meta: { length: productsLength },
    records: products,
  } = await productRepository.findAll({
    where: {
      id: {
        [Op.in]: payload.OrderItems.map((item) => item.productId),
      },
    },
  });
  if (productsLength !== payload.OrderItems.length) {
    ApiError.badRequest('Alguns produtos não foram encontrados');
  }

  const menu = await menuRepository.getCurrent();

  const orderItems = [];
  for (const item of payload.items) {
    const product = products.find((product) => product.id === item.productId);
    if (!product) {
      ApiError.badRequest('Produto não encontrado');
    }

    const selectedDishes = [];
    if (item.selectedDishes) {
      let meatCount, accompanimentCount, garnishCount;
      meatCount = accompanimentCount = garnishCount = 0;

      for (const selectedDish of item.selectedDishes) {
        const { dish, id: dishOnMenuId } = menu.dishes.find(
          (d) => d.dish.id === selectedDish.dishOnMenuId,
        );
        if (!dish) {
          ApiError.badRequest('Prato não encontrado');
        }

        selectedDishes.push({
          id: uuid(),
          dishOnMenuId,
          quantity: selectedDish.quantity,
          isAdditional: selectedDish.isAdditional,
        });

        if (selectedDish.isAdditional) {
          continue;
        }

        switch (dish.type) {
          case DishType.MEAT:
            meatCount += selectedDish.quantity;
            break;
          case DishType.ACCOMPANIMENT:
            accompanimentCount += selectedDish.quantity;
            break;
          case DishType.GARNISH:
            garnishCount += selectedDish.quantity;
            break;
          default:
            break;
        }

        if (meatCount != 0 && meatCount > product.meatPortion) {
          ApiError.badRequest('Quantidade de carne excedida');
        }

        if (
          accompanimentCount != 0 &&
          accompanimentCount > product.accompanimentPortion
        ) {
          ApiError.badRequest('Quantidade de acompanhamento excedida');
        }

        if (garnishCount != 0 && garnishCount > product.garnishPortion) {
          ApiError.badRequest('Quantidade de guarnição excedida');
        }
      }
    }

    orderItems.push({
      id: uuid(),
      productId: product.id,
      quantity: item.quantity,
      selectedDishes,
      weight: item.weight,
      observation: item.observation,
      price: calculateItemPrice(product, item, menu.dishes),
    });
  }

  const order = {
    ...payload,
    customerId: customer.id,
    restaurantId: payload.restaurantId,
    items: orderItems,
    total: orderItems.reduce((acc, item) => acc + item.price, 0),
  };

  await OrderRepository.create({
    payload: order,
  });

  return order;
};
