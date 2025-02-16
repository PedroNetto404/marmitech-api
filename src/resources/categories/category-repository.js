const factory = require('../../utils/generic-repo-factory');
const CategoryModel = require('./category-model');

const categoryRepository = factory.withModel(CategoryModel).build();
module.exports = categoryRepository;
