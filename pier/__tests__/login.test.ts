import app from '../src/app'
import supertest from 'supertest'

describe('Login', () => {
  it('Logs a user in', async () => {
    const res = await supertest(app)
      .post('/login')
      .send({ email: 'test@bken.io', password: 'test-password' })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({
      accessToken: '123',
    })
  })
})
