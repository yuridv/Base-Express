const { db } = require('../../Utils/bases')
const { Errors } = require('../../Utils/functions')

const route = async (socket, value) => {
  try {
    db.socket.sessions.splice(db.socket.sessions.findIndex(r=> r.id == socket.id), 1)
    
    console.log('[Socket]=> disconnect')
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => { return route(socket) })
      .catch((e) => e)
  }
}

module.exports = route