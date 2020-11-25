const Video = require('../../videos/model');

module.exports = async function({ id }) {
  const videos = await Video.find({ user: id });
  const totalViews = videos.reduce((acc, { views }) => {
    acc += views;
    return acc;
  }, 0);
  return totalViews;
};