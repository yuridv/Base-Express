const { Errors, Validate } = require('../../../Utils/functions')

const route = async (req, res, login) => {
  try {
    req.query = await Validate(req.query, {
      cpf: { required: true, type: 'cpf' }
    })
    return { status: 200, ...req.query }
  } catch(err) {
    return Errors(err, `ROUTE ${__filename}`)
      .then(() => { return route(req, res, login) })
      .catch((e) => e)
  }
}

module.exports = { 
  route, 
  method: 'GET'
}