const View = require('../models/view');
const Video = require('../models/video');

/**
 * Views are counted in the following way
 * Logged in users clicks on a video that is 10 minutes long, the video gets 1 view
 * User then watches for a few miunutes and then clicks away.
 * User comes back after 5 minutes have elapsed since first view, this view is not counted
 * The next view to be counted is when the user comes back after the modification time on the
 * view record is greater than the duration of the video.
 */

module.exports = async (userId, { duration, id: videoId }) => {
  const view = await View.findOne({ user: userId, video: videoId });
  if (view) {
    const videoDuration = duration * 1000;
    if (new Date(view.updatedAt).getTime() < Date.now() - videoDuration) {
      await Promise.all([
        await Video.updateOne({ _id: videoId }, { $inc: { views: 1 } }),
        await View.updateOne({ _id: view._id }, { $inc: { views: 1 } }),
      ]);
    }
  } else {
    await new View({
      user: userId,
      video: videoId,
    }).save();
  }
};
