const request = require('supertest');
const app = require('../../src/app');
const httpStatus = require('http-status');
const workerFarm = require('worker-farm');
const pdfService = require('../../src/services/pdf.service');

afterAll(() => {
  workerFarm.end(pdfService.getWorkers());
});

describe('PDF routes', () => {
  describe('POST /v1/pdf', () => {
    test('should return 200 and a PDF file', async () => {
      const res = await request(app)
        .post('/v1/pdf')
        .send({ url: 'https://www.google.com' })
        .expect(httpStatus.OK);

      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/pdf'));
      expect(res.headers['content-disposition']).toBe('attachment; filename=generated.pdf');
      expect(res.body).toBeInstanceOf(Buffer);
    }, 30000); // 30 second timeout

    test('should return 400 if url is not provided', async () => {
      await request(app)
        .post('/v1/pdf')
        .send({})
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
