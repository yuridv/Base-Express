const Errors = require('./Errors')
const Data = require('./Data')
const Query = require('./Query')
const { db } = require('../bases')
const jwt = require("jsonwebtoken");

const route = (req) => new Promise(async (res,rej) => {
  try {
    if (db.authenticate.ignore.find(r=> r == req.params[0]+'/'+req.method)) return res({})
    req.headers["authorization"] = (req.headers["authorization"] || '').replace('Bearer ','')
    if (!req.headers["authorization"]) return rej({ error: `O token não foi informado...` })

    let token = jwt.verify(req.headers["authorization"], process.env.CRYPTOGRAPHY_KEY, (err, token) => {
      if (err) return { status: 401, error: `O seu token é invalido! Faça login novamente...` }
      return token;
    })
    if (token.error) return rej(token);

    let login = await Query(`SELECT * FROM logins WHERE [token] = '${req.headers["authorization"]}' AND [expire] >= GETDATE()`)
      .then(async (r) => { 
        if (r[0]) return { ...r[0], user: r[0].user.toUpperCase(), expire: await Data(r[0].expire) }
        return false;
      })

    if (!login) return rej({ status: 401, error: `O seu token é invalido ou expirou! Faça login novamente...` });
    return res(login);
  } catch(err) {
    return Errors(err, `FUNCTIONS ${__filename}`)
      .then(() => { return route(req) })
      .catch((e) => rej(e))
  }
})

module.exports = route;