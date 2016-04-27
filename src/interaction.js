const F = require('./functions')
require('./socketHandlers')()

if (window.location.pathname === '/') {

  F.$('#login-btn').addEventListener('click', F.login)

} else if (window.location.pathname.match('create.html')) {

  F.$('#names .input-btn').addEventListener('click', F.createName)
  F.$('[name=\"name\"]').addEventListener('keypress', e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      F.createName(e)
    } else {
      return true
    }
  })

  socket.on('connected', F.readNames)

}