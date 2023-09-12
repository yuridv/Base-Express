require('dotenv-safe').config();
console.log(`[BackEnd]=> Starting...`)

const express = require('express');
const app = express();

const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server)

const routes = () => {}

app
  .use(express.json())

  .get('*', routes)
  .post('*', routes)
  .delete('*', routes)
  .put('*', routes)

io
  .on('connection', async(socket) => {
    console.log(socket)
  })

server
  .listen(process.env.PORT || 3000, async (err) => {
    if (err) return console.log(`[Listen Error]=> `, err)
    console.log(`[BackEnd]=> Successfully Loaded!`)
  })