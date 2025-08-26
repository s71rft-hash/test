const request = require('supertest');
const httpStatus = require('http-status');
const http = require('http');
const app = require('@/app');
const { sequelize, User, Product } = require('@/models');
const { up: upUser, down: downUser } = require('@/migrations/20250813074501-create-user');
const { up: upProduct, down: downProduct } = require('@/migrations/20250826000000-create-product');
const { up: seedUp, down: seedDown } = require('@/seeders/20250813074544-user-seeder');
const { tokenService } = require('@/services');

jest.mock('@/config/redis', () => ({
  get: jest.fn().mockResolvedValue('true'),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue('OK'),
}));

describe('Product routes', () => {
  let server;
  let adminToken;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise(resolve => server.listen(resolve));
    await upUser(sequelize.getQueryInterface(), sequelize.constructor);
    await upProduct(sequelize.getQueryInterface(), sequelize.constructor);
  });

  afterAll(async () => {
    await downProduct(sequelize.getQueryInterface(), sequelize.constructor);
    await downUser(sequelize.getQueryInterface(), sequelize.constructor);
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Product.destroy({ truncate: true, cascade: true });
    await seedUp(sequelize.getQueryInterface(), sequelize.constructor);
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    const tokenResponse = await tokenService.generateAuthTokens(adminUser);
    adminToken = tokenResponse.access.token;
  });

  describe('POST /v1/products', () => {
    let newProduct;

    beforeEach(() => {
      newProduct = {
        name: 'Test Product',
        price: 9.99,
        properties: {
          color: 'red',
          size: 'M',
        },
      };
    });

    it('should create a new product', async () => {
      const res = await request(server)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)
        .expect(httpStatus.CREATED);

      expect(res.body.name).toBe(newProduct.name);
      expect(res.body.price).toBe(newProduct.price);
      expect(res.body.properties.color).toBe('red');
    });
  });
});
