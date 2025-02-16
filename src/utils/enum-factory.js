
const enumFactory = {
  create: (enumValues) => {
    const values = Object.values(enumValues);

    return Object.freeze({
      ...enumValues,
      values,
    });
  },
};

module.exports = enumFactory;
