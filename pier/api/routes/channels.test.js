const app = require('../../app');
const request = require('supertest');

describe('should test channel routes', () => {
  test('should get channel', () => {
    request(app)
      .get('/')
      .expect('true')
      .toBe('true');
  });
});
