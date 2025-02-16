const ProductType = Object.freeze({
  WITH_CATEGORY: 'with_category',
  MOUNTED_PLATE: 'mounted_plate',
  PLATE_BY_WEIGHT: 'plate_by_weight',
  values: () => {
    // eslint-disable-next-line no-unused-vars
    const { values, ...enumeration } = ProductType;
    return Object.values(enumeration);
  },
});

module.exports = ProductType;
