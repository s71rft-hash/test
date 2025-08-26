const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

jest.mock('@/config/redis', () => ({
  get: jest.fn().mockResolvedValue('true'),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue('OK'),
  on: jest.fn(),
  sadd: jest.fn().mockResolvedValue(1),
  srem: jest.fn().mockResolvedValue(1),
  smembers: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/config/rabbitmq', () => ({
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue(),
  rabbitmqService: {
    publish: jest.fn(),
    consume: jest.fn(),
  },
}));
