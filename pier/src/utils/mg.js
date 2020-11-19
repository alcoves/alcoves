
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: process.env.MG_API_KEY, domain: 'mg.bken.io' });

function send(msg) {
  return new Promise((resolve, reject) => {
    mg.messages().send(msg, (error, body) => {
      if (error) reject(error);
      resolve(body);
    });
  });
};

module.exports = {
  send,
};