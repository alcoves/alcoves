const View = require('../models/view');
const Video = require('../models/video');

const viewVideo = async function (userId, { duration, id: videoId }) {
  console.log('videoDuration', duration);
  const view = await View.findOne({ user: userId, video: videoId });
  if (view) {
    console.log('user has viewed video before');
    const videoDuration = duration * 1000;
    if (new Date(view.updatedAt).getTime() < Date.now() - videoDuration) {
      console.log('user rewatched the video');
      await Promise.all([
        await Video.updateOne({ _id: videoId }, { $inc: { views: 1 } }),
        await View.updateOne({ _id: view._id }, { $inc: { views: 1 } }),
      ]);
    } else {
      console.log('duplicate view');
    }
  } else {
    console.log('first time user has viewed video');
    await View({
      user: userId,
      video: videoId,
    }).save();
  }
};

module.exports = {
  viewVideo,
};
