import { Elysia } from 'elysia';

const app = new Elysia();

app.get('/', () => 'Hello');
app.get('/health', () => 'Healthy');

app.ws('/ws', {
  message(ws, message) {
    setInterval(() => {
      ws.send('Pong');
    }, 1000);
    // ws.send(message);
  },
});

app.listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
