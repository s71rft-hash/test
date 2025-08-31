const request = require('supertest');
const httpStatus = require('http-status');
const app = require('@/app');

describe('View routes', () => {
  describe('GET /v1/', () => {
    it('should return 200 and render the index view', async () => {
      const res = await request(app).get('/v1/').expect(httpStatus.OK);

      expect(res.text).toContain('<h1>Hello from EJS!</h1>');
    });
  });
});
