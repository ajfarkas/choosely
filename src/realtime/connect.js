export default function initSocket(cb) {
  window.Data = {
    names: {}
  }

  window.socket = io()

  socket.on('connect', () => {
    console.log('socket connected.')
  }).on('disconnect', () => {
    console.log('socket disconnected.')
  })

  if (cb) {
    return cb()
  }
}