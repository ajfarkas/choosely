const socket = io()

socket.on('connect', () => {
  console.log('socket connected.')
}).on('disconnect', () => {
  console.log('socket disconnected.')
})