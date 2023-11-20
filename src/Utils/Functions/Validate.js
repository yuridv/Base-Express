const Errors = require('./Errors')

const route = (body, camps, error = '') => new Promise(async (res,rej) => {
  try {
    if (body && camps) {
      
      for (let key in camps) {
        if (!body[key] && camps[key].required) {
          error += `\n* O Campo '${camps[key].name || key}' não foi preenchido...`
        } else if (body[key] || body[key] == '0') {
          if (camps[key].type) camps[key].type = camps[key].type.charAt(0).toUpperCase() + camps[key].type.slice(1).toLowerCase();

          if (Types[camps[key].type]) {
            await Types[camps[key].type](camps, body, key)
              .catch((e) => error += '\n* ' + e)
          } else if (camps[key].type) error += '\n* O tipo "' + camps[key].type + '" não é valido...'


          // if (camps[key].type == 'phone') body[key] = await typePhone(body[key]);
          // if (camps[key].type == 'email') body[key] = await typeEmail(body[key]);
          // if (camps[key].type == 'date') body[key] = await typeDate(body[key]);





          // if (typeof body[key] == 'string') body[key] = body[key].trim()
          // if (camps[key].remove_zeros) body[key] = await Zeros(body[key])

          // if (camps[key].replace) {
          //   for (let i in camps[key].replace) {
          //     i = camps[key].replace[i]
          //     if (i.includes('/')) {
          //       body[key] = body[key].replaceAll(i.split('/')[0], i.split('/')[1])
          //     } else body[key] = body[key].replaceAll(i, '')
          //   }
          // }


          // } else if (camps[key].type == 'phone') {
          //   body[key] = body[key].replaceAll(' ','').replaceAll('.','').replaceAll('-','').replaceAll('(','').replaceAll(')','')
          //   if (!Number(body[key]) || body[key].length !== 11) {
          //     error += `\n* O Campo '${camps[key].name || key}' não é um Telefone valido...! Exemplo: (51) 9 1234-5678`
          //   }
          // } else if (camps[key].type == 'email') {
          //   body[key] = body[key].toLowerCase().replaceAll(' ','')
          //   if (!body[key].includes('@') || !body[key].includes('.com')) {
          //     error += `\n* O Campo '${camps[key].name || key}' não é um Email valido...! Exemplo: exemplo@gmail.com`
          //   }
          // } else if (camps[key].type == 'date') {
          //   body[key] = new Date(body[key])
          //   if (body[key] != 'Invalid Date') {
          //     body[key] = new Date(body[key].setHours(body[key].getHours() -3)).toISOString().split('T')
          //     let date = body[key][0].split('-').map(r=> Number(r))
          //     if (date[0] < 1900 || date[0] > 2100 || date[1] < 1 || date[1] > 12 || date[2] < 1 || date[2] > 31) {
          //       error += `\n* O Campo '${camps[key].name || key}' não possui uma data valida... Data Inserida: ${date.reverse().join('/')}`
          //     }
          //     let time = body[key][1].split('.')[0].split(':').map(r=> Number(r))
          //     if (time[0] < 0 || time[0] > 23 || time[1] < 0 || time[1] > 60 || time[2] < 0 || time[2] > 60) {
          //       error += `\n* O Campo '${camps[key].name || key}' não possui uma hora valida... Data Inserida: ${date.reverse().join('/')}`
          //     } else body[key] = new Date(body[key].join('T'))
          //   } else error += `\n* O Campo '${camps[key].name || key}' foi preenchido com uma data invalida...`
          // }
 
          if (camps[key].len && String(body[key]).length != camps[key].len) {
            error += `\n* O Campo '${camps[key].name || key}' precisa conter '${camps[key].length}' carcteres...`
          }
          if (camps[key].min && String(body[key]).length < camps[key].min) {
            error += `\n* O Campo '${camps[key].name || key}' precisa conter no minimo '${camps[key].min}' carcteres...`
          }
          if (camps[key].max && String(body[key]).length > camps[key].max) {
            error += `\n* O Campo '${camps[key].name || key}' precisa conter no maximo '${camps[key].max}' carcteres...`
          }

          if (camps[key].include) {
            if (!camps[key].include.includes(body[key])) {
              error += `\n* O Campo '${camps[key].name || key}' precisa incluir um desses: '${camps[key].include.join(', ')}'...`
            }
          }

        }
      }
  
      if (error) return rej({ error: error.replace('\n','') })
      return res(body)
    } else return res(body)
  } catch(err) {
    return Errors(err, `Validate ${__filename}`)
      .then(() => { return route(req) })
      .catch((e) => rej(e))
  }
})

module.exports = route;

// REMOVER ZEROS DA FRENTE
async function Zeros(v) {
  if (v.slice(0,1) == "0") v = v.slice(1,v.length);
  if (v.slice(0,1) == "0") return Zeros(v);
  return v;
}


const Types = {

  String: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key])
    if (body[key] && body[key] !== '[object Object]') {
      return res();
    } else return rej(`O Campo '${camps[key].name || key}' precisa ser um texto...`);
  }),

  Number: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key]).replace(',','.')
    if (body[key].includes('.')) {
      let aux = body[key].split('.');
      body[key] = aux.filter((r,i)=> i < (aux.length - 1)).join('') + '.' + aux[aux.length - 1]
    }
    body[key] = Number(body[key]);
    if (body[key]) {
      return res();
    } else return rej(`O Campo '${camps[key].name || key}' precisa conter apenas números...`)
  }),

  Array: async (camps, body, key) => new Promise(async (res,rej) => {
    if (typeof body[key] == 'string') {
      if (body[key].includes(',')) {
        body[key] = body[key].split(',')
      } else if (body[key].includes(';')) {
        body[key] = body[key].split(';')
      } else if (body[key].includes('|')) {
        body[key] = body[key].split('|')
      } else if (body[key].includes('+')) {
        body[key] = body[key].split('+')
      } else if (body[key].includes('-')) {
        body[key] = body[key].split('-')
      } else if (body[key].includes('_')) {
        body[key] = body[key].split('_')
      }
    }
    if (typeof body[key] == 'string') body[key] = [ body[key] ]

    if (typeof body[key] == 'object' && body[key].length > 0) {
      return res();
    } else return rej(`O Campo '${camps[key].name || key}' precisa ser uma lista...`)
  }),

  Cpf: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key]).replaceAll(' ','').replaceAll('.','').replaceAll('-','')
    if (body[key].length <= 11 && Number(body[key])) {
      body[key] = (("00000000000" + body[key]).slice(-11)).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      return res();
    } else return rej(`O Campo '${camps[key].name || key}' não é um CPF valido...! Exemplo: 123.456.789-11`);
  }),

  Phone: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key]).replaceAll(' ','').replaceAll('.','').replaceAll('-','').replaceAll('(','').replaceAll(')','')
    if (body[key].length == 11 && Number(body[key])) {
      body[key] = Number(body[key]);
      return res();
    } else return rej(`O Campo '${camps[key].name || key}' não é um Telefone valido...! Exemplo: (12) 9 1234-5678`);
  }),

  Email: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key]).replaceAll(' ','').toLowerCase()
    if (body[key].includes('@') && body[key].includes('.com')) {
      return res();
    } else return rej(`O Campo '${camps[key].name || key}' não é um Email valido...! Exemplo: exemplo@gmail.com`);
  }),

  Date: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = new Date(body[key])
    if (body[key] != 'Invalid Date') {
      body[key] = new Date(body[key].setHours(body[key].getHours() - 3)).toISOString().split('T')
      let date = body[key][0].split('-').map(r=> Number(r))
      if (date[0] < 1900 || date[0] > 2100 || date[1] < 1 || date[1] > 12 || date[2] < 1 || date[2] > 31) {
        return rej(`O Campo '${camps[key].name || key}' não possui uma data valida... Data Inserida: ${date.reverse().join('/')}`)
      }
      let time = body[key][1].split('.')[0].split(':').map(r=> Number(r))
      if (time[0] < 0 || time[0] > 23 || time[1] < 0 || time[1] > 59 || time[2] < 0 || time[2] > 59) {
        return rej(`O Campo '${camps[key].name || key}' não possui uma horario valido... Data Inserida: ${date.reverse().join('/')}`)
      }
      body[key] = new Date(body[key].join('T'));
      return res();
    } else return rej(`O Campo '${camps[key].name || key}' foi preenchido com uma data invalida...`);
  })

}