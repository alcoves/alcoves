import db from '../../../utils/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      console.log('Recieving Tidal Webhook', req.body.event);
      const { id } = req.body.data;
      switch (req.body.event) {
      case 'video.asset.thumbnail.ready':
        const { thumbnail_url } = req.body.data;
        await db.video.update({ 
          where: { id },
          data: { thumbnail: thumbnail_url },
        });
        break;
      case 'video.asset.ready':
        await db.video.update({ 
          where: { id },
          data: {
            status: req.body.data.status,
            mpdLink: req.body.data.mpd_link,
            percentCompleted:  req.body.data.percent_completed,
          },
        });
        break;
      case 'video.asset.started':
        await db.video.update({ 
          where: { id },
          data: {
            status: req.body.data.status,
            percentCompleted:  req.body.data.percent_completed,
          },
        });
        break;
      case 'video.asset.updated':
        await db.video.update({ 
          where: { id },
          data: {
            status: req.body.data.status,
            percentCompleted:  req.body.data.percent_completed,
          },
        });
        break;
      default:
        console.log(`Event "${req.body.event}" not found`);
        break;
      }
      res.status(200).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}