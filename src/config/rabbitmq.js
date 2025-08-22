const rabbitmqService = require('../services/rabbitmq.service');
const logger = require('./logger');

const connect = async () => {
  await rabbitmqService.connect();
};

const disconnect = async () => {
  await rabbitmqService.close();
};

module.exports = {
  connect,
  disconnect,
  rabbitmqService,
};
