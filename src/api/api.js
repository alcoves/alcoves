import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'production' ? 'https://api.bken.io' : 'http://localhost:3000';

export default async config => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) config.headers = { authorization: `Bearer ${accessToken}` };
    config.url = `${baseUrl}${config.url}`;
    console.log('axios config', JSON.stringify(config, null, 2));
    return axios(config);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
