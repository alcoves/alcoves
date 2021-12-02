import app from '../src/app'
import supertest from 'supertest'

describe('Root', () => {
  it('Responds to healthcheck', async () => {
    const res = await supertest(app).get('/')
    expect(res.statusCode).toEqual(200)
  })
})
