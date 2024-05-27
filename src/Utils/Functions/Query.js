let MSSQL = require('./MSSQL');
let Errors = require('./Errors');

const route = (query, db) => new Promise(async (res,rej) => {
  try {
    let pool = await MSSQL(db);

    let sql = await pool.request().query(query);

    return res(sql.recordsets.length > 1 ? sql.recordsets : sql.recordset);
  } catch(err) {
    return Errors(err, `FUNCTIONS ${__filename}`)
      .then(() => route(inputs, query, db))
      .catch((e) => rej(e))
  }
})

module.exports = route