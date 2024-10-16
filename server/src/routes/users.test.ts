import app from '../index'
import { expect, test, describe, beforeAll, afterAll } from 'bun:test'

describe('Users', () => {
    beforeAll(async () => {
        console.log('Mock the user session')
    })

    afterAll(async () => {
        console.log('Clear the user session')
    })

    test('GET /api/users/me', async () => {
        const res = await app.request('/api/users/me')
        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ status: 'ok' })
    })
})
