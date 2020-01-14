const User = require('../models/user');
const Video = require('../models/video');

const escapeRegex = (t) => {
  return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

exports.search = async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.params);
    let searchResult;

    if (req.query.resource === 'users') {
      searchResult = await User.find(
        {
          userName: new RegExp(escapeRegex(req.query.text), 'gi'),
        },
        '-password -email'
      );
    } else if (req.query.resource === 'videos') {
      searchResult = await Video.find({
        title: new RegExp(escapeRegex(req.query.text), 'gi'),
      });
    } else {
      res.status(400).end();
    }

    res.status(200).send({
      message: `search successfull`,
      payload: searchResult,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
