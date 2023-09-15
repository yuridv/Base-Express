const { Errors, Files } = require('../Utils/functions')

const route = async (socket) => {
  try {
    await require('./events')(socket, Files('./src/Events/', '../../Events', 1))

    console.log('connection')
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => { return route(socket) })
      .catch((e) => e)
  }
}

module.exports = route