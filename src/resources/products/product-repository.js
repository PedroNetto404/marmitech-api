const genericRepositoryFactory = require('../../utils/generic-repo-factory');
const ProductModel = require('./product-model');

const productRepository = genericRepositoryFactory
  .withModel(ProductModel)
  .build();

module.exports = productRepository;
