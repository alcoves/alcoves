const Video = require('../../videos/model');

module.exports = async function({ id }) {
  const count = await Video.countDocuments({ user: id });
  return count;
};