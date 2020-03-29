const dynamoose = require('dynamoose');

const Video = dynamoose.model('Video', {
  id: String,
  user: String, // Index
  title: String,
  versions: Array,
  duration: Number,
  thumbnail: String,
  createdAt: Number,
  modifiedAt: Number,
});

export default Video