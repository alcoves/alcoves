import { domain, secure } from '../lib/getCookieEnv';
import { CognitoUserPool, CookieStorage } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_gZpTlBUoo',
  ClientId: '29otoaa79sptnnc5h9jr9jonok',
  Storage: new CookieStorage({ domain, secure }),
};

export default new CognitoUserPool(poolData);
