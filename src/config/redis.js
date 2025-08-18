const Redis = require('ioredis');
const config = require('./config');
const logger = require('./logger');

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  connectTimeout: 10000,
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

module.exports = redisClient;
