import request from 'supertest'
import app from '../app'

describe("Root Endpoint", () => {
  it('should respond 200', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(200)
  })
})