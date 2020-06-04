import { domain, secure } from '../lib/getCookieEnv';
import { CognitoUserPool, CookieStorage } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_wp8hLYSVq',
  ClientId: '7td10a0pdv4rjp7fih1mmfkum2',
  Storage: new CookieStorage({ domain, secure }),
};

export default new CognitoUserPool(poolData);
