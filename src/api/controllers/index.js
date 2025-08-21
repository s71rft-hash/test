const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const controllers = {};

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
    const controllerName = file.split('.')[0];
    const controller = require(path.join(__dirname, file));
    controllers[`${controllerName}Controller`] = controller;
  });

module.exports = controllers;
