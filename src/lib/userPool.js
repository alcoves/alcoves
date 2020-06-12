import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_wp8hLYSVq',
  ClientId: '7td10a0pdv4rjp7fih1mmfkum2',
};

export default new CognitoUserPool(poolData);
