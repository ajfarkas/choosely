import connect from './realtime/connect'
import Help from './helpers/helpers'
// init socket.io
connect()

function login(e) {
  e.preventDefault()
  
  let userId = undefined
  const user = Help.$('[name=\"user\"]').value.toLowerCase()
  const partner = Help.$('[name=\"partner\"]').value.toLowerCase()

  if (user > partner) {
    userId = `${user}_${partner}`
  } else {
    userId = `${partner}_${user}`
  }

  cookie('userId', userId)
  window.location.pathname = '/create'
}

Help.$('#login-btn').addEventListener('click', login)