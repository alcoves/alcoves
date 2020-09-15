const axios = require('axios');

module.exports = async function (job, Meta) {
  const { NOMAD_TOKEN, NOMAD_ADDRESS } = process.env;
  const nomadAddr = `${NOMAD_ADDRESS}/v1/job/${job}/dispatch`;

  if (NOMAD_ADDRESS.includes('localhost')) {
    // bypass production tokens
    return axios.post(nomadAddr, { Meta });
  } 
  return axios.post(
    nomadAddr,
    { Meta },
    {
      timeout: 1000 * 30,
      headers: {
        'X-Nomad-Token': NOMAD_TOKEN,
      },
    }
  );
  
};
