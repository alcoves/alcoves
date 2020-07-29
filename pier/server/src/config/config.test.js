const config = require('./config');

describe('config', () => {
  test('dev config', () => {
    expect(config).toEqual({
      TIDAL_TABLE: 'tidal-dev',
      USERS_TABLE: 'users-dev',
      VIDEOS_TABLE: 'videos-dev',
      TIDAL_BUCKET: 'tidal-bken-dev',
      WASABI_CDN_BUCKET: 'dev-cdn.bken.io',
      WASABI_ENDPOINT: 'https://s3.us-east-2.wasabisys.com',
    });
  });
});
