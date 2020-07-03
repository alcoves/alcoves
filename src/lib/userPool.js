import { CognitoUserPool } from 'amazon-cognito-identity-js';

// TODO :: Add support for prod
const poolData = {
  UserPoolId: 'us-east-2_i0Mrl74B8',
  ClientId: '6loe6isvmd4t1s627a3ujjd4iv',
};

export default new CognitoUserPool(poolData);
