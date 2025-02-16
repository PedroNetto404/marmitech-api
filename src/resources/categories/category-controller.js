const { Op } = require('sequelize');
const categoryRepository = require('./category-repository');
const objectUtils = require('../../utils/object-utils');
const ApiError = require('../../errors/api-error');

module.exports.create = async (req, res, next) => {
  try {
    const exists = await categoryRepository.exists({
      restaurantId: res.locals.user.restaurantId,
      name: req.body.name,
    });
    if (exists) {
      throw ApiError.badRequest('Category already exists');
    }

    const category = await categoryRepository.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

module.exports.findAll = async (req, res, next) => {
  try {
    const categories = await categoryRepository.findAll({
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports.findById = async (req, res, next) => {
  try {
    const category = await categoryRepository.findById(req.params.id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const category = await categoryRepository.findById(req.params.id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    const exists = await categoryRepository.exists({
      restaurantId: res.locals.user.restaurantId,
      name: req.body.name,
      [Op.not]: { id: req.params.id },
    });
    if (exists) {
      throw ApiError.badRequest('Category already exists');
    }

    const updated = objectUtils.merge({
      original: category,
      partial: req.body,
    });

    await categoryRepository.update(req.params.id, updated);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const category = await categoryRepository.findById(req.params.id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    await categoryRepository.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
