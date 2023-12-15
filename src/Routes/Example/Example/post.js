const { Errors, Validate } = require('../../../Utils/functions')

const route = async (req, res, login) => {
  try {
    req.body = await Validate(req.body, {
      cpf: { required: true, type: 'cpf' }
    })
    return { status: 201, ...req.body }
  } catch(err) {
    return Errors(err, `ROUTE ${__filename}`)
      .then(() => { return route(req, res, login) })
      .catch((e) => e)
  }
}

module.exports = { 
  route, 
  method: 'POST'
}