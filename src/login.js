import connect from './realtime/connect'
import Help from './helpers/helpers'
import F from './helpers/func_login'
// init socket.io
connect()

function login(signup) {  
  const username = Help.$('#username').value
  const password = Help.$('#password').value
  const partnername = Help.$('#partnername').value

  if (username && password && partnername) {
    return F.login(username, password, partnername, signup)
  }
  
  const e = new CustomEvent('error')
  if (!username) {
    e.message = 'Your email address is required.'
  } else if (!password) {
    e.message = 'Your password is required.'
  } else if (!partnername) {
    e.message = 'Your partner\'s email address is required.'
  }
  document.dispatchEvent(e)
}

Help.$('#login-btn').addEventListener('click', login)
Help.$('#signup-btn').addEventListener('click', login.bind(null, true))
document.addEventListener('error', e => {
  Help.$('.error-msg').innerText = e.message
})