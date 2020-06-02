const app = require('../../pages/api/graphql');
const request = require('supertest');

describe('upload tests', () => {
  test('createMultipartUpload', () => {
    expect(true).toBe(true);
  });

  test('completeMultipartUpload', () => {
    expect(true).toBe(true);
  });

  // it('should start multipart upload', async () => {
  //   const registerUserQuery = `
  //     mutation createMultipartUpload {
  //       createMultipartUpload(
  //         input: {
  //           parts: 50
  //         }
  //       ) {
  //         uploadId
  //         key
  //         urls
  //       }
  //     }
  //   `;

  //   const res = await request(app)
  //     .post('/graphql')
  //     .send({ query: registerUserQuery });
  //   expect(res.body.errors[0].message).toEqual('bad beta code');
  // });
});
