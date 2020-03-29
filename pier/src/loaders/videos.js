const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

const getVideo = async function () {
  const { Item } = await db.get({
    TableName: 'videos-dev',
    Key: { id: '' }
  }).promise();

  return Item
}

module.exports = {
  getVideo,
};
