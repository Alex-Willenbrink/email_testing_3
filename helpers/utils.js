const UtilsHelper = {};

UtilsHelper.json = obj => {
  return JSON.stringify(obj, null, 2);
};

module.exports = UtilsHelper;
