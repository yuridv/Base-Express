const { Errors, Validate } = require('../../Utils/functions')

const route = async (req, res) => {
  try {
    let body = await Validate(req.body, {
      string: { required: true, type: 'string' },
      number: { required: true, type: 'number', remove_zeros: true },
      array: { required: true, type: 'array' },
      cpf: { required: true, type: 'cpf' },
      phone: { required: true, type: 'phone' },
      email: { required: true, type: 'email' },
      date: { required: true, type: 'date', default: new Date() },
    })
    return { status: 201, ...body }
  } catch(err) {
    return Errors(err, `ROUTE ${__filename}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = { 
  route, 
  method: 'POST'
}