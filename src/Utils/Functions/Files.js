const { readdirSync } = require('fs')

const route = (base, path, lower, dir = '', obj = {}) => {
  readdirSync(base + dir).forEach(async(file) => {
    if (lower) file = file.toLowerCase()
    file = file.split('.')
    if (!dir && ['routes'].includes(file[0])) return;
    if (file[1] == 'js') return obj[file[0]] = require(`${dir || path}/${file[0]}`)
    obj[file[0]] = {}
    route(base, lower,`${dir || path}/${file[0]}`, obj[file[0]])
  })
  return obj;
}

module.exports = route