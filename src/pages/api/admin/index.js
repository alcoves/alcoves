// import db from '../../../utils/db';
// import { getSession, } from 'next-auth/client';

// export default async function handler(req, res) {
//   const session = await getSession({ req });
//   if (!session || session.id !== 1) {
//     return res.status(401).end()
//   }

//   if (req.method === 'PUT') {
//     const videos = await db.video.findMany()
//     console.log('videos', videos.length);

//     await Promise.all(videos.map((v) => {
//       return db.video.update({
//         where: { id: v.id },
//         data: {
//           thumbnail: `https://cdn.bken.io/v/${v.videoId}/thumb.webp`,
//           hlsMasterLink: `https://cdn.bken.io/v/${v.videoId}/hls/master.m3u8`
//         }
//       })
//     }))

//     res.json({ message: 'ok'})
//   }
// }