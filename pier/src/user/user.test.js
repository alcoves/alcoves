const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  });
  // await User.deleteOne({ email: 'jest@bken.io' });
});

afterAll(async () => {
  // await User.deleteOne({ email: 'jest@bken.io' });
  await mongoose.connection.close();
});

describe('user tests', () => {
  it('should return user', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: `query{ users { id } }` });
    expect(res.body.data).toEqual({
      users: [
        { id: '5e0d5191ad6bac5cb92d808b' },
        { id: '5e0f863cbcc3435c5de7de35' },
        { id: '5e0f86cebcc3435c5de7de3d' },
      ],
    });
  });
});

// getUserById
// getUserVideosByUserId
// uploadUserAvatar
