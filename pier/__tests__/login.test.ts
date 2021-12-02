import app from '../src/app'
import supertest from 'supertest'

describe('Login', () => {
  it('Logs a user in', async () => {
    const res = await supertest(app).post('/login')
    expect(res.statusCode).toEqual(200)
  })
})
