const { Errors, Files } = require('../Utils/functions')

const route = async (socket, next) => {
  try {
    console.log('[Socket]=> connection')
    await Events(socket, Files('./src/Events/Client/', '../../Events/Client/', 1))
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => { return route(socket) })
      .catch((e) => e)
  }
}

module.exports = route

const Events = async (socket, files, dir = '') => {
  try {
    for (e in files) {
      if (typeof files[e] == 'function') {
        socket.on(dir + e, files[e]) 
      } else await Events(socket, files[e], dir + e + '/')
    }
  } catch(err) {
    return Errors(err, `Events ${__filename}`)
      .then(() => { return Events(socket, files[e], dir + e + '/') })
      .catch((e) => e)
  }
}