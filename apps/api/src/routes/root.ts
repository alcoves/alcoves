import { Elysia } from 'elysia'

const router = new Elysia()

router.get('/', () => 'Hello')

router.get('/health', () => 'Healthy')

export default router
