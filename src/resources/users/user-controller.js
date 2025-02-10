const userBusiness = require('./user-business');

module.exports.findById = async (req, res, next) => {
  try {
    const user = await userBusiness.findById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.findAll = async (req, res, next) => {
  try {
    const users = await userBusiness.findAll({
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const user = await userBusiness.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    await userBusiness.remove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports.authenticate = async (req, res, next) => {
  try {
    const token = await userBusiness.authenticate(req.body);
    res.json(token);
  } catch (error) {
    next(error);
  }
};
