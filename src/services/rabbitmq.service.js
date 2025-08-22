const amqp = require('amqplib');
const config = require('../config/config');
const logger = require('../config/logger');

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      const url = `amqp://${config.rabbitmq.user}:${config.rabbitmq.password}@${config.rabbitmq.host}:${config.rabbitmq.port}`;
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      logger.info('Connected to RabbitMQ');

      this.connection.on('error', (err) => {
        logger.error('RabbitMQ connection error', err);
        this.reconnect();
      });

      this.connection.on('close', () => {
        logger.error('RabbitMQ connection closed');
        this.reconnect();
      });
    } catch (err) {
      logger.error('Failed to connect to RabbitMQ', err);
      this.reconnect();
    }
  }

  reconnect() {
    setTimeout(() => {
      logger.info('Reconnecting to RabbitMQ...');
      this.connect();
    }, 5000);
  }

  async publish(exchange, routingKey, message) {
    if (!this.channel) {
      logger.error('RabbitMQ channel is not available.');
      return;
    }
    try {
      this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
      logger.info(`Message published to exchange ${exchange} with routing key ${routingKey}`);
    } catch (err) {
      logger.error('Failed to publish message to RabbitMQ', err);
    }
  }

  async consume(queue, callback) {
    if (!this.channel) {
      logger.error('RabbitMQ channel is not available.');
      return;
    }
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(queue, (msg) => {
        if (msg !== null) {
          callback(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
        }
      });
    } catch (err) {
      logger.error('Failed to consume message from RabbitMQ', err);
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}

module.exports = new RabbitMQService();
