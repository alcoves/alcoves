const User = require('../models/user');

exports.getMe = async (req, res) => {
  try {
    res.status(200).send({
      message: 'successfully fetched user',
      payload: await User.findOne({ _id: req.user.id }).select('-password'),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};
