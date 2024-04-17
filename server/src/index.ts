import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.get('/videos', (c) => {
    return c.json({
        videos: [
            { id: 1, title: 'Video 1' },
            { id: 2, title: 'Video 2' },
            { id: 3, title: 'Video 3' },
        ],
    })
})

app.get('/healthcheck', (c) => {
    return c.text('OK')
})

export default {
    port: 3005,
    fetch: app.fetch,
}
