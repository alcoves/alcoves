const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const verifyToken = async (bearerToken) => {
  const client = jwksClient({
    // https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
    jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USERPOOL_ID}/.well-known/jwks.json`,
  });

  function getJwksClientKey(header, callback) {
    client.getSigningKey(header.kid, function (error, key) {
      if (error) throw new Error('could not get signing key');
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  return new Promise((resolve, reject) => {
    jwt.verify(
      bearerToken,
      getJwksClientKey,
      {
        algorithms: ['RS256'],
        audience: process.env.COGNITO_CLIENT_ID,
        issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USERPOOL_ID}/`,
      },
      function (error, decoded) {
        if (error) reject(error);
        resolve(decoded);
      }
    );
  });
};

module.exports = verifyToken;
