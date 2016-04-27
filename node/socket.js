const socket = require('socket.io')
const put = require('./clientPut')
const get = require('./clientGet')

function createNew(server) {
  const io = socket(server)
  console.log('new socket connection')

  io.on('connection', (client) => {
    console.log('user connected.', client.id)
    client.on('put', data => {
      put(client, data)
    })
    client.on('get', data => {
      get(client, data)
    })
    client.emit('connected', true)
  }).on('disconnect', () => {
    console.log('user disconnected.')
  }).on('error', err => {
    console.error(err)
  })
}

module.exports = { createNew }