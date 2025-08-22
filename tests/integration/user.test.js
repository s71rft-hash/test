const request = require('supertest');
const httpStatus = require('http-status');
const http = require('http');
const { io } = require('socket.io-client');
const app = require('@/app');
const { sequelize, User } = require('@/models');
const { up: upUser, down: downUser } = require('@/migrations/20250813074501-create-user');
const { up: upRealm, down: downRealm } = require('@/migrations/20250821052444-create-realm');
const { up: upRole, down: downRole } = require('@/migrations/20250821052449-create-role');
const { up: upUserRealmRole, down: downUserRealmRole } = require('@/migrations/20250821052453-create-user-realm-role');
const { up: seedUp, down: seedDown } = require('@/seeders/20250813074544-user-seeder');
const { tokenService } = require('@/services');
const { initSocket } = require('@/socket');
const redisClient = require('@/config/redis');

jest.mock('@/config/redis', () => ({
  get: jest.fn().mockResolvedValue('true'),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue('OK'),
}));

describe('User and Socket routes', () => {
  let server;
  let adminUser;
  let regularUser;
  let adminToken;

  beforeAll(async () => {
    server = http.createServer(app);
    initSocket(server);
    await new Promise(resolve => server.listen(resolve));
    await upUser(sequelize.getQueryInterface(), sequelize.constructor);
    await upRealm(sequelize.getQueryInterface(), sequelize.constructor);
    await upRole(sequelize.getQueryInterface(), sequelize.constructor);
    await upUserRealmRole(sequelize.getQueryInterface(), sequelize.constructor);
  });

  afterAll(async () => {
    await downUserRealmRole(sequelize.getQueryInterface(), sequelize.constructor);
    await downRole(sequelize.getQueryInterface(), sequelize.constructor);
    await downRealm(sequelize.getQueryInterface(), sequelize.constructor);
    await downUser(sequelize.getQueryInterface(), sequelize.constructor);
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  });

  beforeEach(async () => {
    await seedDown(sequelize.getQueryInterface(), sequelize.constructor);
    await seedUp(sequelize.getQueryInterface(), sequelize.constructor);
    adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    regularUser = await User.findOne({ where: { email: 'user@example.com' } });
    const tokenResponse = await tokenService.generateAuthTokens(adminUser);
    adminToken = tokenResponse.access.token;
  });

  describe('GET /v1/users', () => {
    it('should return 200 and apply the default query options', async () => {
      const res = await request(server)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK);

      expect(res.body.results).toHaveLength(2);
      expect(res.body.currentPage).toBe(1);
      expect(res.body.limit).toBe(10);
      expect(res.body.results[0].UserRealmRoles).toBeDefined();
    });
  });

  describe('POST /v1/users', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password1',
        roles: [{ realmId: 1, roleId: 2 }],
      };
    });

    it('should create a new user and emit a user:created event', (done) => {
      const clientSocket = io(`http://localhost:${server.address().port}`, {
        auth: { token: adminToken },
      });

      clientSocket.on('connect_error', (err) => {
        done(err);
      });

      clientSocket.on('connect', async () => {
        const res = await request(server)
          .post('/v1/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newUser)
          .expect(httpStatus.CREATED);

        expect(res.body.name).toBe(newUser.name);
      });

      clientSocket.on('user:created', (data) => {
        expect(data.name).toBe(newUser.name);
        clientSocket.disconnect();
        done();
      });
    });
  });
});
