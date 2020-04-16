const app = require('../app');
const shortid = require('shortid');
const request = require('supertest');

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const deleteUser = async (testEmail) => {
  const { Items } = await db
    .query({
      TableName: 'users-dev',
      IndexName: 'email-index',
      KeyConditionExpression: '#email = :email',
      ExpressionAttributeValues: { ':email': testEmail },
      ExpressionAttributeNames: { '#email': 'email' },
    })
    .promise();

  if (Items.length) {
    const id = Items[0].id;
    await db
      .delete({
        Key: { id },
        TableName: 'users-dev',
      })
      .promise();
  }
};

describe('users', () => {
  const testEmail = 'tests@bken.io';
  const testPassword = shortid.generate();
  beforeAll(() => deleteUser(testEmail));

  test('register test user', async () => {
    const register = `
      mutation {
        register(input: {
          email: "${testEmail}"
          password: "${testPassword}"
          displayName: "Test Account"
          code: "${process.env.BETA_CODE}"
        }) {
          accessToken
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query: register });
    expect(res.body.data.register.accessToken).toBeDefined();
  });

  test('login test user', async () => {
    const login = `
      mutation {
        login(input: {
          email: "${testEmail}"
          password: "${testPassword}"
        }) {
          accessToken
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query: login });
    expect(res.body.data.login.accessToken).toBeDefined();
  });
});
