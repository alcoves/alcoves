const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('./model');
const sid = require('shortid');

const testAccountEmail = `${sid()}@bken.io`;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  });

  await User.deleteOne({ email: testAccountEmail });
});

afterAll(async () => {
  await User.deleteOne({ email: testAccountEmail });
  await mongoose.connection.close();
});

describe('user tests', () => {
  it('should create a user', async () => {
    const createUserQuery = `
      mutation createUser {
        createUser(
          input: {
            displayName: "Test User"
            email: "${testAccountEmail}"
            password: "password"
          }
        ) {
          id
          email
          displayName
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query: createUserQuery });

    expect(res.body.errors).toEqual(undefined);
    expect(res.body.data.createUser).toMatchObject({
      displayName: 'Test User',
      email: testAccountEmail,
    });
  });

  it('should return user', async () => {
    const { _id } = await User.findOne({ email: testAccountEmail });
    const id = _id.toString();

    const userQuery = `
      {
        user(id: "${id}") {
          id
          email
          avatar
          followers
          displayName
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query: userQuery });
    expect(res.body.data).toEqual({
      user: {
        id,
        email: testAccountEmail,
        avatar:
          'https://s3.us-east-2.wasabisys.com/media-bken/files/avatar.jpg',
        followers: 0,
        displayName: 'Test User',
      },
    });
  });
});

// getUserVideosByUserId
// uploadUserAvatar
