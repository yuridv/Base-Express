require('dotenv-safe').config();
console.log(`[BackEnd]=> Starting...`)

const express = require('express');
const Express = express();

const server = require('http').createServer(Express);

const routes = require('./src/Routes/routes');

Express
  .use(express.json())

  .get('*', routes)
  .post('*', routes)
  .delete('*', routes)
  .put('*', routes)

server
  .listen(process.env.PORT || 3000, async (err) => {
    if (err) return console.log(`[Listen Error]=> `, err)
    console.log(`[BackEnd]=> Successfully Loaded!`)
  })