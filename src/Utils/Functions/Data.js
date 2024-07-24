let Errors = require('./Errors');

const route = (data, timer = {}, ignore = {}) => new Promise(async (res,rej) => {
  try {
    let date = data ? new Date(data) : new Date();
    if (!data) date.setHours(date.getHours() - 3);

    if (timer.seconds) date.setSeconds(date.getSeconds() + timer.seconds)
    if (timer.minutes) date.setMinutes(date.getMinutes() + timer.minutes)
    if (timer.hours) date.setHours(date.getHours() + timer.hours)
    if (timer.days && !ignore.uteis && !ignore.feriados) date.setDate(date.getDate() + timer.days)
    if (timer.months) date.setMonth(date.getMonth() + timer.months)
  
    if (timer.days && (ignore.uteis || ignore.feriados)) {
      let negativo;
      if (timer.days < 0) {
        negativo = true;
        timer.days = Math.abs(timer.days)
      }
      while (timer.days > 0) {
        date.setDate(date.getDate() + (negativo ? -1 : 1))
        let check = date.toISOString().slice(5,10);
        if (ignore.uteis && (date.getDay() == 0 || date.getDay() == 6)) {
          // console.log('[Final de Semana]=> ' + check)
        } else if (ignore.feriados && feriados.find(r=> r == check)) {
          // console.log('[Feriado]=> ' + check)
        } else timer.days -= 1
      }
    }
    return res(date);
  } catch(err) {
    return Errors(err, `FUNCTIONS ${__filename}`)
      .then(() => {
        return route(inputs, proc, db)
          .then((r) => res(r))
          .catch((e) => rej(e))
      })
      .catch((e) => rej(err));
  }
})

module.exports = route

let feriados = [
  '01-01', // ANO NOVO
  '02-20', // CARNAVAL
  '02-21', // CARNAVAL
  '04-07', // SEXTA SANTA
  '04-21', // TIRADENTES
  '05-01', // DIA DO TRABALHADOR
  '06-08', // CORPUS CHRISTI
  '09-07', // INDEPENDENCIA
  '09-20', // FARROUPILHA
  '10-12', // NOSSA SENHORA
  '11-02', // FINADOS
  '11-15', // REPUBLICA
  '12-25', // NATAL
]