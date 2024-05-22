const { Errors, Authenticate, MSSQL } = require('../Utils/functions')

const route = async (socket, next) => {
  try {
    return Authenticate({ headers: { authorization: socket.handshake.auth.token }, params: [] }, await MSSQL())
      .then(async (login) => {
        socket.login = login;
        next();
      })
      .catch((e) => {
        const err = new Error(e.error);
        err.data = e;
        next(err);
      })
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => { return route(socket) })
      .catch((e) => e)
  }
}

module.exports = route