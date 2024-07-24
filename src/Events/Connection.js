const { db } = require('../Utils/bases')
const { Errors, Files } = require('../Utils/functions')

const route = async (socket, next) => {
  try {
    await Events(socket, Files('./src/Events/Client/', '../../Events/Client/', 1))

    db.socket.sessions.push(socket);

    console.log('[Socket]=> connection')
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
        let route = files[e];
        socket.on(dir + e, (...args) => route(socket, ...args));
      } else await Events(socket, files[e], dir + e + '/')
    }
  } catch(err) {
    return Errors(err, `Events ${__filename} Events()`)
      .then(() => { return Events(socket, files[ev], dir + ev + '/') })
      .catch((e) => e)
  }
}