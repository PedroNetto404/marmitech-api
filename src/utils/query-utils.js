module.exports.findAll = async (
  model,
  {
    limit = 10,
    offset = 0,
    sort: { field = 'createdAt', order = 'DESC' } = {},
    where = {},
  },
) => {
  const records = await model.findAll({
    where,
    limit,
    offset,
    order: [[field, order.toUpperCase()]],
  });

  const count = await model.count({ where });

  return {
    meta: {
      count,
      limit,
      offset,
      page: Math.floor(offset / limit) + 1,
      pages: Math.ceil(count / limit),
    },
    records: records.map((record) => record.toJSON()),
  };
};
