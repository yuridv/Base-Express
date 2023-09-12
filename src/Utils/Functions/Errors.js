const route = (err, menu) => new Promise(async (res,rej) => {
  menu = menu.replace(process.cwd(), '').replace('\\src','').replaceAll('\\','/')
  if (err.error) {
    return rej({ error: err.error })
  } else {
    console.log(err)
    console.log(`[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema...`)
    return rej({ error: `[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema! Tente novamente mais tarde...` })
  }
})

module.exports = route