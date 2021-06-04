export function getTidalURL() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://bk-det1.bken.dev/tidal';
  }
  // return 'http://localhost:4000/videos'
  return 'https://bk-det1.bken.dev/tidal';
}

export function getWebhookURL(id) {
  if (process.env.NODE_ENV === 'production') {
    return `https://bken.io/api/videos/${id}`;
  }
  // return `http://localhost:3000/api/videos/${id}`
  return `https://bken.io/api/videos/${id}`;
}