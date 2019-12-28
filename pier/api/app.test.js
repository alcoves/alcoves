const app = require('./app');
const request = require('supertest');

describe('should test root routes', () => {
  test('should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.body.message).toEqual('welcome to the api');
  });

  test('should return 200', async () => {
    const res = await request(app).get('/favicon.ico');
    expect(res.body.length).toEqual(10228);
  });
});

describe('should test root routes', () => {
  test('should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.body.message).toEqual('welcome to the api');
  });

  test('should return 200', async () => {
    const res = await request(app).get('/favicon.ico');
    expect(res.body.length).toEqual(10228);
  });
});
