const route = (err, menu) => new Promise(async (res,rej) => {
  menu = menu.replace(process.cwd(), '').replace('\\src','').replaceAll('\\','/')
  if (err.error) {
    return rej({ error: err.error })
  } else if (err.code == "ETIMEOUT") {
    await Timeout(60000)
    return res('TIMEOUT');
  } else if (err.code == "ESOCKET") {
    await Timeout(60000)
    return res('CONNECTION');
  } else if (err.code == "EREQUEST" && (err.message || '').includes('chosen as the deadlock victim')) {
    await Timeout(5000)
    return res('DEADLOCK');
  } else if (err.code == "EREQUEST" && (err.message || '').includes('The duplicate key value')) {
    return rej({ error: `Não é possivel salvar algo que já existe no banco de dados...` })
  } else if (err.code == "EREQUEST" && err.message && err.message.includes('nvarchar to smalldatetime')) {
    return rej({ error: `Não foi possivel salvar pois alguma data é invalida! Verifique e tente novamente...` })
  } else if (err.code == "EREQUEST" && err.precedingErrors && err.precedingErrors[0]) {
    return rej({ error: (':'+err.precedingErrors[0]).split(': ')[1] })
  } else if (err.code == "EREQUEST" && err.originalError && err.originalError[0]) {
    return rej({ error: (':'+err.originalError[0]).split(': ')[1] })
  } else {
    console.log(err)
    console.log(`[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema...`)
    return rej({ error: `[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema! Tente novamente mais tarde...` })
  }
})

module.exports = route