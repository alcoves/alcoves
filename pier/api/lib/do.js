const axios = require('axios');
const baseUrl = 'https://api.digitalocean.com';

module.exports = async (config) => {
  try {
    config.headers = { authorization: `Bearer ${process.env.DO_API_KEY}` };
    config.url = `${baseUrl}${config.url}`;
    return axios(config);
  } catch (error) {
    throw error;
  }
};
