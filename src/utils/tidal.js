import axios from 'axios';
import { getSession, } from 'next-auth/client';

const NODE_ENV = process.env.NODE_ENV;
const TIDAL_API_KEY = process.env.TIDAL_API_KEY;

export function getTidalURL() {
  if (NODE_ENV === 'production') {
    return 'https://tidal.bken.io';
  }
  return 'http://localhost:4000';
}

function getTidalHeaders() {
  return {
    'X-API-Key': TIDAL_API_KEY,
    'Content-Type': 'application/json',
  };
}

async function createThumbnail(id) {
  await axios.post(`${getTidalURL()}/videos/${id}/thumbnail`,
    { input: `https://cdn.bken.io/v/${id}/original` },
    { headers: getTidalHeaders() })
    .catch(console.error);
}

async function createVideo(id) {
  await axios.post(`${getTidalURL()}/videos/${id}`,
    { input: `https://cdn.bken.io/v/${id}/original` },
    { headers: getTidalHeaders() })
    .catch(console.error);
}

// async function processAllVideos(videos) {
//   await Promise.all(videos.map(({ id }) => createVideo(id)));
// }

// async function processAllThumbnails(videos) {
//   await Promise.all(videos.map(({ id }) => createThumbnail(id)));
// }

async function deleteVideo(req, res) {
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

export {
  createVideo,
  deleteVideo,
  createThumbnail
};