const db = require('../config/db');

const getUserById = async function (id) {
  const queryCmd = `select * from users where id = '${id}';`;
  const res = await db.query(queryCmd);
  return res.rows[0];
};

module.exports = {
  getUserById,
};
