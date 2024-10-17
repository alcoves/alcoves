import app from '../../../src/index'
import { expect, test, describe } from 'bun:test'

describe('Root', () => {
    test('GET /', async () => {
        const res = await app.request('/')
        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ status: 'ok' })
    })

    test('GET /health', async () => {
        const res = await app.request('/health')
        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ status: 'ok' })
    })

    test('GET /api/health', async () => {
        const res = await app.request('/api/health')
        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ status: 'ok' })
    })
})
