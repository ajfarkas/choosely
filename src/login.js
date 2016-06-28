import connect from './realtime/connect'
import Help from './helpers/helpers'
import F from './helpers/func_login'
// init socket.io
connect()

function login(signup) {  
  const username = Help.$('#username').value
  const password = Help.$('#password').value
  const partnername = Help.$('#partnername').value

  F.login(username, password, partnername, signup)
}

Help.$('#login-btn').addEventListener('click', login)
Help.$('#signup-btn').addEventListener('click', login.bind(null, true))