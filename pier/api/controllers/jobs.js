const convertSourceVideo = require('../lib/convertSourceVideo');

exports.createJob = async (req, res) => {
  const convertRes = await convertSourceVideo({ videoId: req.body.videoId });
  res.status(202).send({
    message: `job created`,
    payload: convertRes.body,
  });
};
