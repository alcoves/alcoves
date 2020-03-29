const app = require('../app');
const request = require('supertest');

describe('video tests', () => {
  // it('should start multipart upload', async () => {
  //   const registerUserQuery = `
  //     mutation createMultipartUpload {
  //       createMultipartUpload(
  //         input: {
  //           title: "Test User"
  //         }
  //       ) {
  //         accessToken
  //       }
  //     }
  //   `;

  //   const res = await request(app)
  //     .post('/graphql')
  //     .send({ query: registerUserQuery });
  //   expect(res.body.errors[0].message).toEqual('bad beta code');
  // });

  it('getVideo', async () => {
    const getVideoQuery = `
      query video {
        video(id: "test") {
          title
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query: getVideoQuery });
    expect(res.body).toEqual('test');
  });
});
