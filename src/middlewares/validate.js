const validate = (schema) => (req, res, next) => {
  const { error, data } = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  
  if (error) {
    res.status(400).json({ error: error.errors });
  }

  req.body = data.body;
  req.params = data.params;
  req.query = data.query;

  next();
};

module.exports = validate;
