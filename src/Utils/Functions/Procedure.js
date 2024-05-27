let MSSQL = require('./MSSQL');
let Errors = require('./Errors');

const route = (proc, inputs, db) => new Promise(async (res,rej) => {
  try {
    let pool = await MSSQL(db);

    let procedure = pool.request();
    for (let input of inputs) {
      procedure.input(input.name, input.value);
    }
    await procedure.execute(proc)
      .then(r=> procedure = r);

    return res(procedure.recordsets.length > 1 ? procedure.recordsets : procedure.recordset);
  } catch(err) {
    return Errors(err, `FUNCTIONS ${__filename}`)
      .then(() => {
        return route(inputs, proc, db)
          .then((r) => res(r))
          .catch((e) => rej(e))
      })
      .catch((e) => rej(err))
  }
})

module.exports = route