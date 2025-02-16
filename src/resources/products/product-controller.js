const productRepository = require('./product-repository');
const productBusiness = require('./product-business');

module.exports.findAll = async (req, res, next) => {
  try {
    const {
      query: { limit = 10, offset = 0, sort, filter },
    } = req;

    const products = await productRepository.findAll({
      limit,
      offset,
      sort,
      where: filter,
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

module.exports.findById = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    const product = await productRepository.findById(id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { body } = req;
    const product = await productBusiness.create({
      ...body,
      restaurant: {
        id: res.locals.user.restaurantId,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const product = await productBusiness.update({
      id,
      payload: {
        ...body,
        restaurant: {
          id: res.locals.user.restaurant,
        },
      },
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    await productRepository.delete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports.updateImage = async (req, res, next) => {
  try {
    const {
      params: { id },
      file,
    } = req;
    const product = await productBusiness.updateImage({
      id,
      image: file.buffer,
      mimetype: file.mimetype
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
}
