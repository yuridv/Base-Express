const { Errors, Validate } = require('../../../Utils/functions')

const route = async (req, res) => {
  try {
    let body = await Validate(req.query, {
      cpf: { required: true, type: 'cpf' }
    })
    return { status: 200, cpf: body.cpf }
  } catch(err) {
    return Errors(err, `ROUTE ${__filename}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = { 
  route, 
  method: 'GET'
}