const merge = ({ original, partial }) => Object.entries(original).reduce((acc, [key, value]) => { 
  if (!partial[key]) {
    return { ...acc, [key]: value };
  } 

  if (typeof value === 'object') {
    return { ...acc, [key]: merge({ original: value, partial: partial[key] }) };
  }

  if (Array.isArray(value)) {
    return { ...acc, [key]: partial[key] };
  }

  return { ...acc, [key]: partial[key] };
}, {});

const objectUtils = {
  merge,
};

module.exports = objectUtils;


