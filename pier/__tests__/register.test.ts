import app from '../src/app'
import supertest from 'supertest'

describe('Register', () => {
  it('Registers a user', async () => {
    const res = await supertest(app).post('/register')
    expect(res.statusCode).toEqual(200)
  })
})
