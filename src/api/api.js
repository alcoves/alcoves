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

export const login = async data => {
  try {
    return axios.post(`${baseUrl}/users/login`, data);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to log user in');
  }
};
