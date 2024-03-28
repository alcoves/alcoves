import { Elysia } from 'elysia'

export default new Elysia().group('/', (app) =>
  app.get('/', () => 'Hello').get('/health', () => 'Healthy')
)
