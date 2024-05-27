const { Errors } = require('../../../Utils/functions')

const route = async (socket, value) => {
  try {
    console.log('[Socket]=> example/test', value)

    return true;
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => { return route(socket) })
      .catch((e) => e)
  }
}

module.exports = route