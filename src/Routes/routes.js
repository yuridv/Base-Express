const { db } = require('../Utils/bases')
const { Errors, Files } = require('../Utils/functions')

let routes = Files('./src/Routes/', '../../Routes', 1)

const route = async (req, res) => {
  try {
    let route = routes;
    for (let param of req.params[0].replace('/','').split("/")) {
      if (!route[param]) return res.status(500).send({ error: `O endereço da API é invalido...` });
      route = route[param]
    }
    if (!route) return res.status(404).send({ error: `A URI inserida não foi encontrada...` });

    req.method = req.method.toLowerCase()
    if (!route[req.method] || typeof route[req.method] != 'function') return res.status(405).send({ error: `O metodo solicitado é invalido para essa URI...` });

    route = await route[req.method](req, res);
    if (!route) return res.status(502).send({ error: `O endereço da API não retornou uma resposta valida...` });
    return res.status(route.status || 500).send(route);

  } catch(err) {

  }
}

module.exports = route

/*
  STATUS CODE:
    200 - OK - SUCESSO
    201 - CREATED - SUCESSO POST
    202 - ACCEPTED - ENTROU NA FILA
    204 - NO CONTENT - SEM CONTEUDO PARA RESPONDER
    301 - MOVED PERMANENTLY - A URI MUDOU
    400 - BAD REQUEST - SINTAX INVALIDA
    401 - UNAUTHORIZED - NÃO AUTENTICADO
    403 - FORBIDDEN - SEM AUTORIZAÇÃO
    404 - NOT FOUND - NÃO ENCONTRADO
    405 - METHOD NOT ALLOWED - METODO SOLICITADO INVALIDO
    409 - CONFLICT - REQUEST ENTROU EM CONFLITO
    423 - LOCKED - CONTEUDO TRAVADO
    429 - MUITAS REQUICIÇÕES
    500 - INTERNAL SERVER ERROR - SITUAÇÃO INESPERADA
    502 - BAD GATEWAY - API RETORNOU UMA RESPOSTA INVALIDA
    503 - SERVICE UNAVAILABLE - SERVIDOR EM MANUTENÇÃO
    504 - GATEWAY TIMEOUT - REQUEST DEMOROU MUITO
    508 - LOOP DETECTED - LOOP INFINITO DETECTADO
*/ 