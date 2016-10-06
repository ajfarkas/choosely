export default function initSocket(cb) {
  // check for jwt
  if (!location.pathname.match(/^\/$|^\/login$/)) {
    if (!localStorage.token) {
      localStorage.clear()
      location.pathname = '/login'
    }
  }

  window.Data = {
    user: {},
    names: {},
    lastnames: {},
    pools: [],
    bracket: []
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