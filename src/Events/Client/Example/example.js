const { Errors } = require('../../../Utils/functions')

const route = async (socket) => {
  try {
    console.log(socket)
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => { return route(socket) })
      .catch((e) => e)
  }
}

module.exports = route