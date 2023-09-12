const Errors = require('./Errors')

const route = (body, camps, error = '') => new Promise(async (res,rej) => {
  try {
    if (body && camps) {
      
      for (let key in camps) {
        if (!body[key] && camps[key].required) {
          error += `\n* O Campo '${camps[key].name || key}' não foi preenchido...`
        } else if (body[key] || body[key] == '0') {
          if (typeof body[key] == 'string') body[key] = body[key].trim()
          if (camps[key].remove_zeros) body[key] = await Zeros(body[key])

          if (camps[key].replace) {
            for (let i in camps[key].replace) {
              i = camps[key].replace[i]
              if (i.includes('/')) {
                body[key] = body[key].replaceAll(i.split('/')[0], i.split('/')[1])
              } else body[key] = body[key].replaceAll(i, '')
            }
          }

          if (camps[key].type == 'number') {
            body[key] = String(body[key]).replace(',','.')
            if (!Number(body[key]) || body[key] == '0') {
              error += `\n* O Campo '${camps[key].name || key}' precisa conter apenas números...`
            } else body[key] = Number(body[key].replace(',','.'))
          } else if (camps[key].type == 'string') {
            if (!String(body[key])) {
              error += `\n* O Campo '${camps[key].name || key}' precisa ser um texto...`
            } else body[key] = String(body[key])
          } else if (camps[key].type == 'cpf') {
            body[key] = body[key].replaceAll(' ','').replaceAll('.','').replaceAll('-','')
            if (!Number(body[key]) || body[key].length !== 11) {
              error += `\n* O Campo '${camps[key].name || key}' não é um CPF valido...! Exemplo: 123.456.789-11`
            }
          } else if (camps[key].type == 'phone') {
            body[key] = body[key].replaceAll(' ','').replaceAll('.','').replaceAll('-','').replaceAll('(','').replaceAll(')','')
            if (!Number(body[key]) || body[key].length !== 11) {
              error += `\n* O Campo '${camps[key].name || key}' não é um Telefone valido...! Exemplo: (51) 9 1234-5678`
            }
          } else if (camps[key].type == 'email') {
            body[key] = body[key].toLowerCase().replaceAll(' ','')
            if (!body[key].includes('@') || !body[key].includes('.com')) {
              error += `\n* O Campo '${camps[key].name || key}' não é um Email valido...! Exemplo: exemplo@gmail.com`
            }
          } else if (camps[key].type == 'date') {
            body[key] = new Date(body[key])
            if (body[key] != 'Invalid Date') {
              body[key] = new Date(body[key].setHours(body[key].getHours() -3)).toISOString().split('T')
              let date = body[key][0].split('-').map(r=> Number(r))
              if (date[0] < 1900 || date[0] > 2100 || date[1] < 1 || date[1] > 12 || date[2] < 1 || date[2] > 31) {
                error += `\n* O Campo '${camps[key].name || key}' não possui uma data valida... Data Inserida: ${date.reverse().join('/')}`
              }
              let time = body[key][1].split('.')[0].split(':').map(r=> Number(r))
              if (time[0] < 0 || time[0] > 23 || time[1] < 0 || time[1] > 60 || time[2] < 0 || time[2] > 60) {
                error += `\n* O Campo '${camps[key].name || key}' não possui uma hora valida... Data Inserida: ${date.reverse().join('/')}`
              } else body[key] = new Date(body[key].join('T'))
            } else error += `\n* O Campo '${camps[key].name || key}' foi preenchido com uma data invalida...`
          }
 
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