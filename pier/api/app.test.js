const app = require('./app');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require('./models/user');

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
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    });
    await User.deleteOne({ email: 'jest@bken.io' });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'jest@bken.io' });
    await mongoose.connection.close();
  });

  test('should fail if beta code is invalid', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        code: 'haxxxxxxx!',
        email: 'jest@bken.io',
        password: 'password123',
        displayName: 'Jest Account',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('bad beta code');
  });

  test('should create user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        code: process.env.BETA_CODE,
        email: 'jest@bken.io',
        password: 'password123',
        displayName: 'Jest Account',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('registration successful');
  });

  test('should fail if user already exists', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        code: process.env.BETA_CODE,
        email: 'jest@bken.io',
        password: 'password123',
        displayName: 'Jest Account',
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual('user already exists');
  });

  test('should query for user', async () => {
    const user = await User.findOne({ email: 'jest@bken.io' });
    const userQuery = await request(app).get(`/users/${user._id}`);
    expect(userQuery.body.payload).toMatchObject({
      __v: 0,
      followers: 0,
      displayName: 'Jest Account',
      avatar: 'https://s3.us-east-2.wasabisys.com/media-bken/files/avatar.jpg',
    });
  });
});
