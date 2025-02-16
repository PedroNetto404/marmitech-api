const productRepository = require('./product-repository');
const categoryRepository = require('../categories/category-repository');
const restaurantRepository = require('../restaurants/restaurant-repository');
const uuid = require('uuid');
const ApiError = require('../../errors/api-error');
const { Op } = require('sequelize');
const objectStorageService = require('../../services/object-storage-service');
const envs = require('../../../config/env');
const objectUtils = require('../../utils/object-utils');

module.exports.create = async (payload) => {
  const restaurant = await restaurantRepository.findById(payload.restaurant.id);
  if (!restaurant) {
    ApiError.notFound('Restaurant not found');
  }

  const category = await categoryRepository.findOne({
    id: payload.category.id,
    restaurantId: payload.restaurant.id,
  });
  if (!category) {
    ApiError.notFound('Category not found');
  }

  const productAlreadyExists = await productRepository.exists({
    name: payload.name,
    restaurantId: payload.restaurantId,
  });
  if (productAlreadyExists) {
    ApiError.badRequest('Product already exists');
  }

  const product = {
    ...payload,
    id: uuid.v4(),
  };

  await productRepository.create(product);

  delete product.category;
  delete product.restaurant;

  return {
    ...product,
    category: {
      id: category.id,
      name: category.name,
    },
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
    },
  };
};

module.exports.update = async ({ id, payload }) => {
  const product = await productRepository.findById(id);
  if (!product) {
    ApiError.notFound('Product not found');
  }

  const categoryExists = await categoryRepository.exists({
    id: payload.category.id,
    restaurantId: payload.restaurant.id,
  });
  if (!categoryExists) {
    ApiError.notFound('Category not found');
  }

  const productAlreadyExists = await productRepository.exists({
    name: payload.name,
    restaurantId: product.restaurant.id,
    [Op.not]: { id },
  });
  if (productAlreadyExists) {
    ApiError.badRequest('Product already exists');
  }

  const updated = objectUtils.merge({
    original: product,
    partial: payload,
  });

  await productRepository.update(id, updated);

  return updated;
};

module.exports.updateImage = async ({ id, image, mimetype }) => {
  const product = await productRepository.findById(id);
  if (!product) {
    ApiError.notFound('Product not found');
  }

  const key = `PRODUCT_IMAGE_${id}_${product.restaurant.id}.${mimetype.split('/')[1]}`;
  await objectStorageService.upload({
    key,
    file: image,
    bucket: 'products',
  });

  product.imageUrl = `${envs.staticFilesUrl}?key=${key}`;
  await productRepository.update(id, product);

  return product;
};
