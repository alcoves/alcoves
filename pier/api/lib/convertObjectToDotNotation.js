const convertObjectToDotNotation = (obj, newObj = {}, prefix = '') => {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      convertObjectToDotNotation(obj[key], newObj, prefix + key + '.');
    } else {
      newObj[prefix + key] = obj[key];
    }
  }

  return newObj;
};

module.exports = convertObjectToDotNotation;
