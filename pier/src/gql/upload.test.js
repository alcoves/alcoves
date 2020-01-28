const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  });

  await Video.deleteOne({ _id: 'test' });
});

afterAll(async () => {
  await Video.deleteOne({ _id: 'test' });
  await mongoose.connection.close();
});

// Video flow
// Start multipart upload (start an s3 upload, returns signed urls)
// Upload parts (client side put requests to signed urls)
// Complete multipart upload (compeltes the upload then creates video record)

describe('upload tests', () => {
  it('should start multipart upload', async () => {
    const registerUserQuery = `
      mutation createMultipartUpload {
        createMultipartUpload(
          input: {
            parts: 50
          }
        ) {
          uploadId
          key
          urls
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query: registerUserQuery });
    expect(res.body.errors[0].message).toEqual('bad beta code');
  });
});
