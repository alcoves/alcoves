const User = require('../models/user');
const Video = require('../models/video');

exports.getUserById = async (req, res) => {
  try {
    res.status(200).send({
      message: 'successfully fetched user',
      payload: await User.findOne({ _id: req.params.userId }).select(
        '-password -email'
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};

exports.getUserVideosByUserId = async (req, res) => {
  try {
    res.status(200).send({
      message: 'successfully fetched user videos',
      payload: await Video.find({ author: req.params.userId }),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};
