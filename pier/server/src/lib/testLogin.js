const AWS = require('aws-sdk');
const cog = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-2' });

const {
  TEST_USERNAME,
  TEST_PASSWORD,
  TEST_USERPOOL_ID,
  TEST_CLIENT_ID,
} = process.env;

async function login() {
  const { AuthenticationResult } = await cog
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      UserPoolId: TEST_USERPOOL_ID,
      ClientId: TEST_CLIENT_ID,
      AuthParameters: {
        USERNAME: TEST_USERNAME,
        PASSWORD: TEST_PASSWORD,
      },
    })
    .promise();
  return AuthenticationResult.AccessToken;
}

module.exports = login;
