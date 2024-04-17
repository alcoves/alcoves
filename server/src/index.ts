import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/healthcheck', (c) => {
  return c.text('OK')
})

export default { 
  port: 3005, 
  fetch: app.fetch, 
} 

