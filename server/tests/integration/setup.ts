import { eq } from 'drizzle-orm'
import { db } from '../../src/db'
import { beforeAll, afterAll } from 'bun:test'
import { sessions, users } from '../../src/db/schema'

export const testUser = {
    id: 'test-user-id',
    email: 'test@alcoves.io',
    avatar: 'https://example.com/avatar.jpg',
}

export const testSession = {
    id: 'mocked-secure-session-id',
    userId: testUser.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
}

beforeAll(async () => {
    await db.transaction(async (tx) => {
        await tx.delete(users).where(eq(users.id, testUser.id))
        await tx.delete(sessions).where(eq(sessions.id, testSession.id))
    })

    await db.transaction(async (tx) => {
        await tx.insert(users).values(testUser)
        await tx.insert(sessions).values(testSession)
    })
})

afterAll(async () => {
    await db.transaction(async (tx) => {
        await tx.delete(users).where(eq(users.id, testUser.id))
        await tx.delete(sessions).where(eq(sessions.id, testSession.id))
    })
})
