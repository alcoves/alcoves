const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');

describe('should test channel routes', () => {
  beforeAll(() => {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  test('should get channel', async () => {
    const { body, status } = await request(app).get('/channels/bken');
    expect(status).toEqual(200);
    expect(body).toEqual({ message: 'bken' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
