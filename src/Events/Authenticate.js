const { Errors, Authenticate, MSSQL } = require('../Utils/functions')

const route = async (socket, next) => {
  try {
    return Authenticate({ headers: { authorization: socket.handshake.auth?.token || socket.handshake.headers?.token }, params: [] }, await MSSQL())
      .then(async (login) => {
        socket.login = login;
        next();
      })
      .catch((e) => {
        const err = new Error(e.error);
        err.data = e;
        console.log(err)
        next(err);
      })
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => { return route(socket) })
      .catch((e) => e)
  }
}

module.exports = route