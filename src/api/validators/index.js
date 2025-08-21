const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const validators = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const validatorName = file.split('.')[0];
    const validator = require(path.join(__dirname, file));
    validators[`${validatorName}Validator`] = validator;
  });

module.exports = validators;
