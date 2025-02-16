const factory = require('../../utils/generic-repository');
const CategoryModel = require('./category-model');

const categoryRepository = factory.withModel(CategoryModel).build();
module.exports = categoryRepository;
