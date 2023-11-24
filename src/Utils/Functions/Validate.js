const Errors = require('./Errors')

const route = (body, camps, error = '') => new Promise(async (res,rej) => {
  try {
    if (body && camps) {
      
      for (let key in camps) {
        // DEFINIR VALOR PADRÃO CASO NÃO ESTEJA PREENCHIDO
        if (!body[key] && camps[key].default) body[key] = camps[key].default

        if (!body[key] && camps[key].required) {
          error += `\n* O campo '${camps[key].name || key}' não foi preenchido...`
        } else if (body[key] || body[key] == '0') {
          // REMOVER ESPAÇOS DA FRENTE E DO FINAL
          if (typeof body[key] == 'string') body[key] = body[key].trim()

          // REMOVER ZEROS DA FRENTE
          if (camps[key].remove_zeros) body[key] = await Functions.Zeros(body[key]);

          // SUBSTITUIR PALAVRAS
          if (camps[key].replace) await Functions.Replace(camps, body, key);

          // VERIFIAR O TIPO
          if (camps[key].type) camps[key].type = camps[key].type.charAt(0).toUpperCase() + camps[key].type.slice(1).toLowerCase();
          if (Types[camps[key].type]) {
            await Types[camps[key].type](camps, body, key).catch((e) => error += '\n* ' + e);
          } else if (camps[key].type) error += '\n* O tipo "' + camps[key].type + '" do campo "' + (camps[key].name || key) + '" não é valido...'

          // VERIFICAR SE CONTEM UMA PALAVRA
          if (camps[key].equal) await Functions.Equal(camps, body, key).catch((e) => error += '\n* ' + e);

          // VERIFICAR A QUANTIDADE DE CARACTERES
          if (camps[key].len || camps[key].min || camps[key].max) await Functions.Length(camps, body, key).catch((e) => error += e);
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

const Functions = {
  
  Zeros: async (value) => {
    if (String(value).slice(0,1) == "0") value = value.slice(1,value.length);
    if (String(value).slice(0,1) == "0") return Functions.Zeros(value);
    return value;
  },

  Replace: async (camps, body, key) => {
    for (let i in camps[key].replace) {
      i = camps[key].replace[i]
      if (i.includes('/')) {
        body[key] = String(body[key]).replaceAll(i.split('/')[0], i.split('/')[1])
      } else body[key] = String(body[key]).replaceAll(i, '')
    }
  },

  Equal: async (camps, body, key) => new Promise(async (res,rej) => {
    if (String(camps[key].include).includes(body[key])) {
      return res();
    } else return rej(`O campo '${camps[key].name || key}' precisa ser igual a um desses: '${camps[key].include.join(', ')}'`)
  }),

  Length: async (camps, body, key) => new Promise(async (res,rej) => {
    let error = '';
    if (camps[key].len && String(body[key]).length != camps[key].len) {
      error += `\n* O campo '${camps[key].name || key}' precisa conter '${camps[key].len}' caracteres...`
    }
    if (camps[key].min && String(body[key]).length < camps[key].min) {
      error += `\n* O campo '${camps[key].name || key}' precisa conter no minimo '${camps[key].min}' caracteres...`
    }
    if (camps[key].max && String(body[key]).length > camps[key].max) {
      error += `\n* O campo '${camps[key].name || key}' precisa conter no maximo '${camps[key].max}' caracteres...`
    }
    if (error) return rej(error);
    return res();
  })

}

const Types = {

  String: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key])
    if (body[key] && body[key] !== '[object Object]') {
      return res();
    } else return rej(`O campo '${camps[key].name || key}' precisa ser um texto...`);
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
    } else return rej(`O campo '${camps[key].name || key}' precisa conter apenas números...`)
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
    } else return rej(`O campo '${camps[key].name || key}' precisa ser uma lista...`)
  }),

  Cpf: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key]).replaceAll(' ','').replaceAll('.','').replaceAll('-','')
    if (body[key].length <= 11 && Number(body[key])) {
      body[key] = (("00000000000" + body[key]).slice(-11))//.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      return res();
    } else return rej(`O campo '${camps[key].name || key}' não é um CPF valido...! Exemplo: 123.456.789-11`);
  }),

  Phone: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key]).replaceAll(' ','').replaceAll('.','').replaceAll('-','').replaceAll('(','').replaceAll(')','')
    if (body[key].length == 11 && Number(body[key])) {
      body[key] = String(body[key]);
      return res();
    } else return rej(`O campo '${camps[key].name || key}' não é um Telefone valido...! Exemplo: (12) 9 1234-5678`);
  }),

  Email: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = String(body[key]).replaceAll(' ','').toLowerCase()
    if (body[key].includes('@') && body[key].includes('.com')) {
      return res();
    } else return rej(`O campo '${camps[key].name || key}' não é um Email valido...! Exemplo: exemplo@gmail.com`);
  }),

  Date: async (camps, body, key) => new Promise(async (res,rej) => {
    body[key] = new Date(body[key])
    if (body[key] != 'Invalid Date') {
      body[key] = new Date(body[key].setHours(body[key].getHours() - 3)).toISOString().split('T')
      let date = body[key][0].split('-').map(r=> Number(r))
      if (date[0] < 1900 || date[0] > 2100 || date[1] < 1 || date[1] > 12 || date[2] < 1 || date[2] > 31) {
        return rej(`O campo '${camps[key].name || key}' não possui uma data valida... Data Inserida: ${date.reverse().join('/')}`)
      }
      let time = body[key][1].split('.')[0].split(':').map(r=> Number(r))
      if (time[0] < 0 || time[0] > 23 || time[1] < 0 || time[1] > 59 || time[2] < 0 || time[2] > 59) {
        return rej(`O campo '${camps[key].name || key}' não possui uma horario valido... Data Inserida: ${date.reverse().join('/')}`)
      }
      body[key] = new Date(body[key].join('T'));
      return res();
    } else return rej(`O campo '${camps[key].name || key}' foi preenchido com uma data invalida...`);
  })

}