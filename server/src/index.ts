import auth from './routes/auth'
import videos from './routes/videos'
import alcoves from './routes/alcoves'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use(logger())
app.use(cors())

app.get('/', (c) => {
    return c.text('OK')
})

app.get('/healthcheck', (c) => {
    return c.text('OK')
})

app.route('/auth', auth)
app.route('/videos', videos)
app.route('/alcoves', alcoves)

export default {
    port: 3005,
    fetch: app.fetch,
}
