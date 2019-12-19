import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'production' ? 'http://api.bken.io' : 'http://localhost:3000';

export default config => {
  return new Promise((resolve, reject) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) config.headers = { authorization: `Bearer ${accessToken}` };
    config.url = `${baseUrl}${config.url}`;
    console.log('axios config', JSON.stringify(config, null, 2));
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
    throw error;
  }
};
