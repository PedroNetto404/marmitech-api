const restaurantBusiness = require('./restaurant-business');

const create = async (req, res, next) => {
  try {
    const restaurant = await restaurantBusiness.create({
      payload: req.body,
      auth: res.locals.user,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
}

const findAll = async (req, res, next) => {
  try {
    const restaurants = await restaurantBusiness.findAll();

    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
}

const findById = async (req, res, next) => {
  try {
    const restaurant = await restaurantBusiness.findById(req.params.id);

    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const restaurant = await restaurantBusiness.update({
      id: req.params.id,
      payload: req.body,
    });

    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
}

const remove = async (req, res, next) => {
  try {
    await restaurantBusiness.remove(req.params.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};
