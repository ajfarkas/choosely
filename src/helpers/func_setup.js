import cookie from '../static/js.cookie.js'

const F = {}

F.readNames = () => {
  socket.emit('get', {
    verb: 'read',
    subject: 'names',
    user: cookie('userId')
  })
}

export default F