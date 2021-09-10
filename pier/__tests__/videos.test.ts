import request from 'supertest'
import app from '../src/app'

describe("Videos Endpoint", () => {
  it('should respond 404', async () => {
    const res = await request(app)
      .get('/videos/id')
    expect(res.statusCode).toEqual(404)
  })

  it('should respond 200', async () => {
    const res = await request(app)
      .get('/videos/OYtQ4YBeTIeiH5voS7W_T')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchSnapshot()
  })
})