require('dotenv-safe').config();
console.log(`[BackEnd]=> Starting...`);

const express = require('express');
const app = express();

const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const routes = require('./src/Routes/routes');

app
  .use(express.json())

  .get('*', routes)
  .post('*', routes)
  .delete('*', routes)
  .put('*', routes);

io
  .use(require('./src/Events/Authenticate'))

  .on('connection', require('./src/Events/Connection'))

server
  .listen(process.env.PORT || 3000, async (err) => {
    if (err) return console.log(`[Listen Error]=> `, err)
    console.log(`[BackEnd]=> Successfully Loaded!`)
  });