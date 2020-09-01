const app = require('../local');
const request = require('supertest');
const login = require('../lib/testLogin');

describe('users', () => {
  test('userById', async () => {
    const completeMultipartUpload = `query user {
      user(id: "a1832f4a-265f-445d-9992-ce970e18094c") {
        id
        email
        avatar 
        nickname
        username
      }
    }`;

    const res = await request(app).post('/graphql').send({ query: completeMultipartUpload });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data).toEqual({
      user: {
        nickname: 'automation',
        username: 'automation',
        email: 'automation@dev.bken.io',
        avatar: 'https://dev.bken.io/favicon.ico',
        id: 'a1832f4a-265f-445d-9992-ce970e18094c',
      },
    });
  });

  test('unauth: me', () => {
    return request(app)
      .post('/graphql')
      .send({
        query: `query me {
        me { id }
      }`,
      })
      .then((res) => {
        expect(res.body.errors[0].message).toEqual("Cannot read property 'sub' of null");
      });
  });

  test('me', async () => {
    const token = await login();

    const completeMultipartUpload = `query me {
      me {
        id
        email
        avatar 
        nickname
        username
      }
    }`;

    const res = await request(app).post('/graphql').set('Authorization', `Bearer ${token}`).send({
      query: completeMultipartUpload,
    });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data).toEqual({
      me: {
        nickname: 'automation',
        username: 'automation',
        email: 'automation@dev.bken.io',
        avatar: 'https://dev.bken.io/favicon.ico',
        id: 'a1832f4a-265f-445d-9992-ce970e18094c',
      },
    });
  });
});
