export const Queues = {
  ingest: {
    name: 'ingest',
    handlers: ['ingestFromUrl'],
  },
  transcode: {
    name: 'transcode',
    handlers: [],
  },
  thumbnail: {
    name: 'thumbnail',
    handlers: [],
  },
}
