const request = require('supertest');
const httpStatus = require('http-status');
const http = require('http');
const app = require('@/app');
const { sequelize, User, Product, Category } = require('@/models');
const { up: upUser } = require('@/migrations/20250813074501-create-user');
const { up: upProduct } = require('@/migrations/20250826000000-create-product');
const { up: upCategory } = require('@/migrations/20250826104621-create-category');
const { up: upProductCategory } = require('@/migrations/20250826104819-add-categoryId-to-product');
const { down: downUser } = require('@/migrations/20250813074501-create-user');
const { down: downProduct } = require('@/migrations/20250826000000-create-product');
const { down: downCategory } = require('@/migrations/20250826104621-create-category');
const { up: seedUp } = require('@/seeders/20250813074544-user-seeder');
const { tokenService } = require('@/services');

jest.mock('@/config/redis', () => ({
  get: jest.fn().mockResolvedValue('true'),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue('OK'),
}));

describe('Category routes', () => {
  let server;
  let adminToken;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise(resolve => server.listen(resolve));
    await upUser(sequelize.getQueryInterface(), sequelize.constructor);
    await upCategory(sequelize.getQueryInterface(), sequelize.constructor);
    await upProduct(sequelize.getQueryInterface(), sequelize.constructor);
    await upProductCategory(sequelize.getQueryInterface(), sequelize.constructor);
  });

  afterAll(async () => {
    // down migrations are tricky with foreign keys, so we'll just close the connection
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  });

  beforeEach(async () => {
    await Product.destroy({ truncate: true, cascade: true });
    await Category.destroy({ truncate: true, cascade: true });
    await User.destroy({ truncate: true, cascade: true });
    await seedUp(sequelize.getQueryInterface(), sequelize.constructor);
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    const tokenResponse = await tokenService.generateAuthTokens(adminUser);
    adminToken = tokenResponse.access.token;
  });

  describe('GET /v1/categories', () => {
    it('should return a nested list of categories with product counts', async () => {
      const electronics = await Category.create({ name: 'Electronics', slug: 'electronics' });
      const laptops = await Category.create({ name: 'Laptops', slug: 'laptops', parentId: electronics.id });
      const smartphones = await Category.create({ name: 'Smartphones', slug: 'smartphones', parentId: electronics.id });
      await Category.create({ name: 'Clothing', slug: 'clothing' });

      await Product.create({ name: 'Laptop X', price: 1000, categoryId: laptops.id });
      await Product.create({ name: 'Laptop Y', price: 1500, categoryId: laptops.id });
      await Product.create({ name: 'Phone Z', price: 800, categoryId: smartphones.id });

      const res = await request(server)
        .get('/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(2);
      const electronicsCat = res.body.find(c => c.name === 'Electronics');
      const clothingCat = res.body.find(c => c.name === 'Clothing');

      expect(electronicsCat.productCount).toBe(3);
      expect(electronicsCat.children).toHaveLength(2);
      const laptopsCat = electronicsCat.children.find(c => c.name === 'Laptops');
      const smartphonesCat = electronicsCat.children.find(c => c.name === 'Smartphones');
      expect(laptopsCat.productCount).toBe(2);
      expect(smartphonesCat.productCount).toBe(1);
      expect(clothingCat.productCount).toBe(0);
    });
  });

  describe('GET /v1/categories/:categoryId', () => {
    it('should return a single category with its total product count', async () => {
      const electronics = await Category.create({ name: 'Electronics', slug: 'electronics' });
      const laptops = await Category.create({ name: 'Laptops', slug: 'laptops', parentId: electronics.id });
      await Product.create({ name: 'Laptop X', price: 1000, categoryId: laptops.id });
      await Product.create({ name: 'Laptop Y', price: 1500, categoryId: laptops.id });

      const res = await request(server)
        .get(`/v1/categories/${electronics.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK);

      expect(res.body.name).toBe('Electronics');
      expect(res.body.productCount).toBe(2);
    });
  });
});
