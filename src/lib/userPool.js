import { CognitoUserPool } from 'amazon-cognito-identity-js';

let poolData;

if (window.location.hostname === 'bken.io') {
  poolData = {
    UserPoolId: 'us-east-2_9tWqgabS8',
    ClientId: '386of4k0jkrlgvd11837k2j0km',
  };
} else {
  poolData = {
    UserPoolId: 'us-east-2_i0Mrl74B8',
    ClientId: '6loe6isvmd4t1s627a3ujjd4iv',
  };
}

export default new CognitoUserPool(poolData);
