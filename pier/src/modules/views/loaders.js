
const View = require('./model');
const Video = require('../videos/model');

async function viewVideo(__, { id }, { req, user }) {
  const video = await Video.findById(id);
  
  const requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
  const requestUserAgent = req.headers['user-agent'];
  console.log({ requestIp, requestUserAgent });

  if (!requestIp) {
    return console.error('unable to parse ip address');
  }

  const view = { ip: requestIp, video: video.id };
  const videoDurationInMs = video.duration * 1000;
  const viewTimeout = new Date(Date.now() - videoDurationInMs);

  const recentlyViewedQuery = {
    video: video.id,
    'updatedAt': { $gte: viewTimeout },
  };

  if (user && user.id) {
    console.log('view logic executed in user context');
    view.user = user.id;
    recentlyViewedQuery.user = user.id;
  } else {
    console.log('view logic executed in ip context');
    recentlyViewedQuery.ip = requestIp;
  }

  const hasRecentlyViewed = Boolean(await View.findOne(recentlyViewedQuery));
  console.log({ hasRecentlyViewed });

  if (!hasRecentlyViewed) {
    await new View(view).save();
    await Video.findOneAndUpdate({ _id: video.id }, { $inc: { 'views': 1 }  });
  }

  return true;
}

module.exports = { viewVideo };