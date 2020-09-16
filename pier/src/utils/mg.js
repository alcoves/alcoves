
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: 'key-1fc82bafe5880ed8d0607f79c82a636b', domain: 'mg.bken.io' });

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