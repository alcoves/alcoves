import axios from 'axios';
import user from '../data/User';

const baseUrl =
  process.env.NODE_ENV === 'production' ? 'https://api.bken.io' : 'http://localhost:3000';

export default config => {
  return new Promise((resolve, reject) => {
    if (user.accessToken) {
      config.headers = { authorization: user.accessToken };
    }

    config.url = `${baseUrl}${config.url}`;
    console.log(`making ${config.method} request to ${config.url}`);
    axios(config)
      .then(resolve)
      .catch(reject);
  });
};

export const login = data => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${baseUrl}/user/login`,
      method: 'post',
      withCredentials: true,
      data,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject('there was an error');
      });
  });
};

export const reAuthenticate = () => {
  return new Promise((resolve, reject) => {
    // accessTokens live in memory
    // They expire when page reloads or after 5min
    // To mint a new accessToken, grab the refreshToken from httpOnly cookies
    // We send a request to the api that recieves the cookie.
    // If the refreshToken matches the token in the database, we mint a new accessToken
    // The refresh token stays in the cookie. When we evict the refreshToken from the db...
    // The user will be logged out

    axios({
      url: `${baseUrl}/user/refresh`,
      method: 'post',
      withCredentials: true,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};
