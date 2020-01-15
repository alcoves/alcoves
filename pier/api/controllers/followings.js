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
        follower: req.user.id,
      }).populate('followee', '_id displayName'),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};

exports.createFollowing = async (req, res) => {
  try {
    if (!req.user.id || !req.body.followee) {
      res.status(400).end();
    }

    if (
      await Following.exists({
        follower: req.user.id,
        followee: req.body.followee,
      })
    ) {
      res.status(400).send({ message: 'following already exists' });
    } else {
      const following = await Following({
        follower: req.user.id, // the user that is following
        followee: req.body.followee, // the user that is being followed
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
    if (!req.user.id || !req.body.followee) {
      res.status(400).end();
    }

    await Following.deleteOne({
      follower: req.user.id,
      followee: req.body.followee,
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};
