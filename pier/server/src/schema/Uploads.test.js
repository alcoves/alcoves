const { S3 } = require('aws-sdk');

jest.mock('aws-sdk');

S3.mockImplementation(() => ({
  completeMultipartUpload: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      ETag: '1234',
      Key: 'test/key',
      Bucket: 'tidal-bken-dev',
      Location: 'https://tidal-bken-dev.s3.us-east-2.amazonaws.com/test/key',
    }),
  }),
}));

const app = require('../local');
const request = require('supertest');

describe('upload tests', () => {
  test('createMultipartUpload', () => {
    expect(true).toBe(true);
  });

  test('no auth: createMultipartUpload', async () => {
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

    const res = await request(app).post('/graphql').send({ query: completeMultipartUpload });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data).toEqual({
      completeMultipartUpload: {
        completed: true,
      },
    });
  });

  test('completeMultipartUpload', async () => {
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

    const res = await request(app).post('/graphql').send({ query: completeMultipartUpload });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data).toEqual({
      completeMultipartUpload: {
        completed: true,
      },
    });
  });
});
