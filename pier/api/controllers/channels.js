exports.getChannel = async (req, res) => {
  res.status(200).send({ message: req.params.channelId });
};

exports.createChannel = async (req, res) => {
  res.status(200).send({ message: 'channel created' });
};
