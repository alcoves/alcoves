const app = require('../app');
const request = require('supertest');

describe('video tests', () => {
  let videoId;

  it('createVideo', async () => {
    const createVideo = `
      mutation {
        createVideo(input: {
          user: "test"
          title: "Video"
        }) {
          id
          title
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      .send({ query: createVideo });
    videoId = res.body.data.createVideo.id;
    expect(res.body.data.createVideo.title).toEqual('Video');
  });

  it('getVideoById', async () => {
    const getVideoQuery = `
      query {
        video(id: "${videoId}") {
          id
          title
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      .send({ query: getVideoQuery });
    expect(res.body.data.video.title).toEqual('Video');
  });

  it('deleteVideo', async () => {
    const deleteVideo = `mutation { deleteVideo(id: "${videoId}")}`;
    const res = await request(app)
      .post('/graphql')
      .send({ query: deleteVideo });
    expect(res.body.data.deleteVideo).toEqual(true);
  });
});
