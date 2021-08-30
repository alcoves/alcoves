import axios from 'axios';
import { getSession, } from 'next-auth/client';

const NODE_ENV = process.env.NODE_ENV;
const TIDAL_API_KEY = process.env.TIDAL_API_KEY;

export function getTidalURL() {
  if (NODE_ENV === 'production') {
    return 'https://bken.io/tidal';
  }
  // return 'https://bken.io/tidal';
  return 'http://localhost:4000';
}

function getTidalHeaders() {
  return {
    'X-API-Key': TIDAL_API_KEY,
    'Content-Type': 'application/json',
  };
}

export async function processThumbnail(id) {
  await axios.post(`${getTidalURL()}/videos/${id}/thumbnails`,
    { input: `https://cdn.bken.io/v/${id}/original` },
    { headers: getTidalHeaders() }).catch((err) => {
    console.error(err);
  });
}

export async function processVideo(id) {
  await axios.post(`${getTidalURL()}/videos`,
    { input: '' },
    { headers: getTidalHeaders() }).catch((err) => {
    console.error(err);
  });
}

export async function processAllVideos(videos) {
  await Promise.all(videos.map(({ id }) => processVideo(id)));
}

export async function processAllThumbnails(videos) {
  await Promise.all(videos.map(({ id }) => processThumbnail(id)));
}

export async function deleteVideo(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(403).end();
  
  const data = await pg.query('select user_id from videos where id = $1', [req.query.id]);
  console.log(data);

  await axios.delete(`${getTidalURL()}/videos/${req.query.id}`,
    { headers: getTidalHeaders() }).catch((err) => {
    console.error(err);
  });

  res.status(200).end();
}