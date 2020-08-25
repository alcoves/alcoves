const app = require('../local');
const request = require('supertest');
const login = require('../lib/testLogin');

describe('upload tests', () => {
  test('createMultipartUpload', async () => {
    const token = await login();
    const completeMultipartUpload = `mutation completeMultipartUpload {
      completeMultipartUpload(input: {
        key: "test/key"
        uploadId: "1234"
        objectId: "test"
        parts: [
          {
            ETag: "1234"
            PartNumber: 1
          }
        ]
      }) {
        completed
      }
    }`;

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: completeMultipartUpload });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data).toEqual({
      completeMultipartUpload: {
        completed: true,
      },
    });
  });

  test('completeMultipartUpload', async () => {
    const token = await login();
    const completeMultipartUpload = `mutation completeMultipartUpload {
      completeMultipartUpload(input: {
        key: "test/key"
        uploadId: "1234"
        objectId: "test"
        parts: [
          {
            ETag: "1234"
            PartNumber: 1
          }
        ]
      }) {
        completed
      }
    }`;

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: completeMultipartUpload });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data).toEqual({
      completeMultipartUpload: {
        completed: true,
      },
    });
  });
});
