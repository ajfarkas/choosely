import connect from './realtime/connect'
import Help from './helpers/helpers'
import F from './helpers/func_login'
import cookie from './static/js.cookie.js'
// init socket.io
connect()

function login(e) {
  e.preventDefault()
  
  let userId = undefined
  const username = Help.$('#username').value
  const password = Help.$('#password').value
  const partnername = Help.$('#partnername').value

  const user = Help.$('[name=\"user\"]').value.toLowerCase()
  const partner = Help.$('[name=\"partner\"]').value.toLowerCase()

  if (user > partner) {
    userId = `${user}_${partner}`
  } else {
    userId = `${partner}_${user}`
  }

  cookie('userId', userId)

  F.login(username, password, partnername)
  // window.location.pathname = '/create'
}

Help.$('#login-btn').addEventListener('click', login)