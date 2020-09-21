require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const User = require('./model');

const API_PATH='/api/graphql';

describe('users', () => {
  beforeAll(async () => {
    await mongoose.connect( process.env.DEV_DB_CONNECTION_STRING || '', {
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
        })
      }
    `;

    const res = await request(app)
      .post(API_PATH)
      .send({ query: register });
    
    expect(res.body.errors).toBe(undefined);
    expect(res.body.data.register).toEqual(true);

    // Manually verify account
    const user = await User.findOne({ username: 'testing' });
    user.emailVerified = true;
    await user.save();
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

    const res = await request(app).post(API_PATH).send({ query: login });

    expect(res.body.errors).toBe(undefined);
    expect(Object.keys(res.body.data.login)).toEqual(['token']);
  });
});
