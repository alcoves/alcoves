const AWS = require('aws-sdk');
const { WASABI_ENDPOINT } = require('./config');

const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });

async function init() {
  const { Item: WASABI_ACCESS_KEY_ID } = await db
    .get({ TableName: 'config', Key: { id: 'WASABI_ACCESS_KEY_ID' } })
    .promise();

  const { Item: WASABI_SECRET_ACCESS_KEY } = await db
    .get({ TableName: 'config', Key: { id: 'WASABI_SECRET_ACCESS_KEY' } })
    .promise();

  AWS.config.update({
    credentials: new AWS.Credentials({
      accessKeyId: WASABI_ACCESS_KEY_ID.value,
      secretAccessKey: WASABI_SECRET_ACCESS_KEY.value,
    }),
    region: 'us-east-2',
    maxRetries: 4,
    httpOptions: {
      timeout: 5000,
      connectTimeout: 3000,
    },
  });

  return new AWS.S3({
    endpoint: new AWS.Endpoint(WASABI_ENDPOINT),
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });
}

module.exports = init;
