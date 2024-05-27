require('dotenv-safe').config();
console.log(`[BackEnd]=> Starting...`)

const Express = require('express');
const express = Express();

const server = require('http').createServer(express);

const routes = require('./src/Routes/routes');
console.log(15)
express
  .use(Express.json())

  .get('*', routes)
  .post('*', routes)
  .delete('*', routes)
  .put('*', routes)

server
  .listen(process.env.PORT || 3000, async (err) => {
    if (err) return console.log(`[Listen Error]=> `, err)
    console.log(`[BackEnd]=> Successfully Loaded!`)
  })