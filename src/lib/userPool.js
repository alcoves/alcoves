import { CognitoUserPool } from 'amazon-cognito-identity-js';

const { BKEN_ENV } = process.env;

const poolData = {
  UserPoolId: BKEN_ENV === 'prod' ? 'us-east-2_9tWqgabS8' : 'us-east-2_i0Mrl74B8',
  ClientId: BKEN_ENV === 'prod' ? '386of4k0jkrlgvd11837k2j0km' : '6loe6isvmd4t1s627a3ujjd4iv',
};

export default new CognitoUserPool(poolData);
