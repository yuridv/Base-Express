const { readdirSync } = require('fs')

const route = (base, path, lower, dir = '', obj = {}) => {
  readdirSync(base + dir).forEach(async(file) => {
    let file_dir = file
    if (lower) file = file.toLowerCase()
    file = file.split('.')
    if (!dir && ['routes'].includes(file[0].toLowerCase())) return;
    if (file[1] == 'js') {
      let route = require(`${path}/${dir}/${file[0]}`)
      if (['get','post','put','delete'].includes(file[0])) {
        return obj[file[0]] = route.route;
      } else if (route.method) {
        return obj[file[0]] = { [route.method.toLowerCase()]: route.route };
      } else {
        return obj[file[0]] = route;
      }
    }
    obj[file[0]] = {}
    route(base, path, lower,`${dir ? dir + '/' : ''}${file_dir}`, obj[file[0]])
  })
  return obj;
}

module.exports = route