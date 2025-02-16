const genericRepositoryFactory = require('../../utils/generic-repository');
const ProductModel = require('./product-model');

const productRepository = genericRepositoryFactory
  .withModel(ProductModel)
  .build();

module.exports = productRepository;
