const {
  Client
} = require('pg');

const client = new Client(process.env.PG_CONNECTION_STRING);

client.connect();

module.exports = client;