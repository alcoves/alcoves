import { Hono } from 'hono'
import { html, raw } from 'hono/html'
import { swaggerUI } from '@hono/swagger-ui'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')

  // return c.html(
  //   html`<!DOCTYPE html>
  //     <h1>Hello!</h1>`
  // )

})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app

// export default { 
//   port: 4000, 
//   fetch: app.fetch, 
// } 
