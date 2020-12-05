import axios from 'axios';

function baseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://helm.bken.io/api2';
  }
  return 'http://localhost:4000/api2';
}

export default async function api(url, config = {}) {
  try {
    const requestUrl = `${baseUrl()}${url}`;
    const res = await axios(requestUrl, config);
    return res;
  } catch (error) {
    console.error('there was an api error');
    throw error;
  }
}