import { Hono } from 'hono';
import { transcodeQueue } from './bullmq';

const app = new Hono();

app.get('/', (c) => {
  return c.text('sup');
});

app.get('/healthcheck', (c) => {
  return c.text('OK');
});

app.get('/jobs', async (c) => {
  await transcodeQueue.add('myJobName', { qux: 'baz' });
  return c.json({ message: 'Job created' });
});

app.post('/jobs', async (c) => {
  await transcodeQueue.add('myJobName', { qux: 'baz' });
  return c.json({ message: 'Job created' });
});

export default app;
