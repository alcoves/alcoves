import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

export default async function api(url, config = {}) {
  try {
    const requestUrl = `${BASE_URL}${url}`;
    const res = await axios(requestUrl, config);
    return res;
  } catch (error) {
    console.error('there was an api error');
    throw error;
  }
}