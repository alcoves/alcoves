import { domain, secure } from '../lib/getCookieEnv';
import { CognitoUserPool, CookieStorage } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_51g5g0k1U',
  ClientId: '46jaacr3ahqr160ceou3b47mt7',
  Storage: new CookieStorage({ domain, secure }),
};

export default new CognitoUserPool(poolData);
