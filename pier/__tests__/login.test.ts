import app from '../src/app'
import supertest from 'supertest'
import { prismaMock } from '../__mocks__/singleton'

describe('Login', () => {
  it('Logs a user in', async () => {
    const res = await supertest(app)
      .post('/login')
      .send({ email: 'test@bken.io', password: 'test' })

    prismaMock.user.create.mockResolvedValue({
      id: 'test-id',
      image: '',
      password: 'test',
      username: 'Test User',
      email: 'test@bken.io',
      updatedAt: new Date(),
      createdAt: new Date(),
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.accessToken).toBeDefined()
  })
})
