const customerBusiness = require('./customer-business');

const create = async (req, res, next) => {
  try {
    const customer = await customerBusiness.create({
      payload: req.body,
      auth: res.locals.user,
    });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const customer = await customerBusiness.update({
      id: req.params.id,
      payload: req.body,
    });
    res.json(customer);
  } catch (error) {
    next(error);
  }
}

const remove = async (req, res, next) => {
  try {
    await customerBusiness.remove({
      id: req.params.id,
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

const findAll = async (req, res, next) => {
  try {
    const customers = await customerBusiness.findAll(req.query);
    res.json(customers);
  } catch (error) {
    next(error);
  }
}

const findById = async (req, res, next) => {
  try {
    const customer = await customerBusiness.findById(req.params.id);
    res.json(customer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  update,
  remove,
  findAll,
  findById,
};
