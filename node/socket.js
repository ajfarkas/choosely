const socket = require('socket.io')

function createNew(server) {
  const io = socket(server)
  console.log('new socket connection')

  io.on('connection', (client) => {
    console.log('user connected.', client.id)
    client.on('addName', data => {
      console.log(data)
    })
  }).on('disconnect', () => {
    console.log('user disconnected.')
  }).on('error', err => {
    console.error(err)
  })
}

module.exports = { createNew }