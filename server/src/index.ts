import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default { 
  port: 3005, 
  fetch: app.fetch, 
} 

