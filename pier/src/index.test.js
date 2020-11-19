require('dotenv').config();

const API_PATH='/api/graphql';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index');

const User = require('./modules/users/model');
const Video = require('./modules/videos/model');

describe('end-to-end', () => {
  let token = null;
  let user = {};

  beforeAll(async () => {
    await mongoose.connect(process.env.DEV_DB_CONNECTION_STRING || 'mongodb://localhost:27017/test', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('users', () => {
    test('register', async () => {
      await User.deleteOne({ username: 'testing' });
  
      const register = `
        mutation register {
          register(input: {
            username: "testing"
            password: "1234567890"
            email: "testing@bken.io"
          })
        }
      `;
  
      const res = await request(app)
        .post(API_PATH)
        .send({ query: register });
      
      expect(res.body.errors).toBe(undefined);
      expect(res.body.data.register).toEqual(true);
  
      // Manually verify account
      user = await User.findOne({ username: 'testing' });
      user.emailVerified = true;
      await user.save();
    });
  
    test('login', async () => {
      const login = `
        mutation login {
          login(input: {
            username: "testing"
            password: "1234567890"
          }) {
            token
          }
        }
      `;
  
      const res = await request(app).post(API_PATH).send({ query: login });
  
      expect(res.body.errors).toBe(undefined);
      expect(Object.keys(res.body.data.login)).toEqual(['token']);
      token = res.body.data.login.token;
    });
  });

  describe('videos', () => {
    test('getVideo', async () => {
      const testVideo = await new Video({
        duration: 60,
        user: user.id,
        title: 'test',
      }).save();
    
      const videoQuery = `
        query video {
          video(id: "${testVideo.id}") {
            id
            title
            views
            duration
            thumbnails
            visibility
            tidal {
              status
              versions {
                status
                preset
                percentCompleted
              }
            }
            user {
              id
            }
          }
        }
      `;
    
      const res = await request(app)
        .post(API_PATH)
        .set('Authorization', `Bearer ${token}`)
        .send({ query: videoQuery });
        
      expect(res.body.errors).toBe(undefined);
      expect(res.body.data.video).toMatchObject({
        id: testVideo.id,
        title: 'test',
        views: 0,
        duration: 60,
        thumbnails: [
          'https://cdn.bken.io/files/default-thumbnail-sm.jpg',
        ],
        visibility: 'unlisted',
        tidal: {
          status: 'segmenting',
        },
        user: {
          id: user.id,
        },
      });

      await Video.deleteOne({id: testVideo.id});   
    });

    test('that user can update a video title', async () => {
      const newTitle = 'new title';
      const testVideo = await new Video({
        duration: 60,
        user: user.id,
      }).save();
  
      const updateVideoTitle = `
        mutation updateVideoTitle {
          updateVideoTitle(input: {
            id: "${testVideo.id}"
            title: "${newTitle}"
          }) {
            id
            title
          }
        }
      `;
  
      const res = await request(app)
        .post(API_PATH)
        .set('Authorization', `Bearer ${token}`)
        .send({ query: updateVideoTitle });
      
      expect(res.body.errors).toBe(undefined);
      expect(res.body.data.updateVideoTitle).toMatchObject({
        id: testVideo.id,
        title: newTitle,
      });
    });
  });
});
