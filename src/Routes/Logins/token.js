const { Errors, Validate, Data, Query } = require('../../Utils/functions')
const jwt = require("jsonwebtoken");

const route = async (req, res, login) => {
  try {
    req.body = await Validate(req.body, {
      user: { required: true, type: 'string' },
      password: { required: true, type: 'string' }
    })
    
    let sql = await Query(`
      SELECT * FROM logins WHERE [user] = '${req.body.user}' AND [password] COLLATE Latin1_General_CS_AS = '${req.body.password}'
    `)
      .then(r=> r[0])
    if (!sql || !sql.user) return { status: 401, error: `O usuário ou senha são invalidos...` }
    
    let token = jwt.sign({ user: req.body.user, password: req.body.password, date: new Date() }, process.env.CRYPTOGRAPHY_KEY)
  
    let expire = await Data(null, { hours: 3 })
      .then(r=> r.toISOString().replace('T',' ').replace('Z',''))
      
    await Query(`UPDATE logins SET [token] = '${token}', [expire] = '${expire}' WHERE [user] = '${req.body.user}'`)

    return { status: 200, token: token }
  } catch(err) {
    return Errors(err, `ROUTE ${__filename}`)
      .then(() => { return route(req, res, login) })
      .catch((e) => e)
  }
}

module.exports = { 
  route, 
  method: 'post'
}