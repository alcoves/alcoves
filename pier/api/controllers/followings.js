const User = require('../models/user');
const Following = require('../models/following');

exports.getFollowings = async (req, res) => {
  try {
    if (!req.user.id) {
      res.status(400).end();
    }

    res.status(200).send({
      message: 'success',
      payload: await Following.find({
        followerId: req.user.id,
      }).populate('followeeId', '_id userName'),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};

exports.createFollowing = async (req, res) => {
  try {
    if (!req.user.id || !req.body.followeeId) {
      res.status(400).end();
    }

    if (
      await Following.exists({
        followerId: req.user.id,
        followeeId: req.body.followeeId,
      })
    ) {
      res.status(400).send({ message: 'following already exists' });
    } else {
      const following = await Following({
        followerId: req.user.id, // the user that is following
        followeeId: req.body.followeeId, // the user that is being followed
      }).save();

      await User.updateOne({ _id: req.user.id }, { $inc: { followers: 1 } });

      res.status(200).send({
        message: 'success',
        payload: following,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};

exports.deleteFollowing = async (req, res) => {
  try {
    if (!req.user.id || !req.body.followeeId) {
      res.status(400).end();
    }

    await Following.deleteOne({
      followerId: req.user.id,
      followeeId: req.body.followeeId,
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};
