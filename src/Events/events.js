const { Errors, Files } = require('../Utils/functions')

const route = async (socket, files, dir = '') => {
  try {
    for (e in files) {
      if (typeof files[e] == 'function') {
        socket.on(dir + e, files[e]) 
      } else await route(socket, files[e], dir + e + '/')
    }
  } catch(err) {
    return Errors(err, `Events ${__filename}`)
      .then(() => { return route(socket, files[e], dir + e + '/') })
      .catch((e) => e)
  }
}

module.exports = route