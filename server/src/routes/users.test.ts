import app from '../index'
import { db } from '../lib/db'
import { expect, test, describe, beforeAll, afterAll } from 'bun:test'

function mockSessionCookie() {
    const mockSessionId = 'mocked-secure-session-id'
    return `auth_session=${mockSessionId}; HttpOnly; Secure`
}

const testUserId = 1
const sessionId = 'mocked-secure-session-id'

describe('Users', () => {
    beforeAll(async () => {
        await db.$transaction([
            db.user.deleteMany({ where: { id: testUserId } }),
            db.session.deleteMany({ where: { id: sessionId } }),
        ])

        await db.$transaction([
            db.user.create({
                data: {
                    id: testUserId,
                    email: 'test@alcoves.io',
                    avatar: 'https://example.com/avatar.jpg',
                },
            }),
            db.session.create({
                data: {
                    userId: testUserId,
                    id: sessionId,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                },
            }),
        ])
    })

    afterAll(async () => {
        await db.$transaction([
            db.user.deleteMany({ where: { id: testUserId } }),
            db.session.deleteMany({ where: { id: sessionId } }),
        ])
    })

    test('GET /api/users/me', async () => {
        const res = await app.request('/api/users/me', {
            headers: {
                Cookie: mockSessionCookie(),
            },
        })
        expect(res.status).toBe(200)
        const responseBody = await res.json()
        expect(responseBody).toEqual(
            expect.objectContaining({
                payload: {
                    id: testUserId,
                    email: 'test@alcoves.io',
                    avatar: 'https://example.com/avatar.jpg',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            })
        )
    })
})
