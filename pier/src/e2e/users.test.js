require('dotenv').config();

const app = require('../index');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('users', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('register', async () => {
    await User.deleteOne({ username: 'testing' });

    const register = `
      mutation register {
        register(input: {
          username: "testing"
          password: "1234567890"
          email: "testing@bken.io"
        }) {
          token
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      // .set('Authorization', `Bearer ${token}`)
      .send({ query: register });
    expect(Object.keys(res.body.data.register)).toEqual(['token']);
  });

  test('login', async () => {
    const login = `
      mutation login {
        login(input: {
          username: "testing"
          password: "1234567890"
        }) {
          token
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query: login });
    expect(Object.keys(res.body.data.login)).toEqual(['token']);
  });
});
