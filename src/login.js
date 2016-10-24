import connect from './realtime/connect'
import Help from './helpers/helpers'
import F from './helpers/func_login'
// init socket.io
connect()

function login(signup) {  
  const username = Help.$('#username').value
  const password = Help.$('#password').value
  const partnername = Help.$('#partnername').value
  
  const e = new CustomEvent('message')
  if (!username) {
    e.message = 'Your email address is required.'
  } else if (!password) {
    e.message = 'Your password is required.'
  } else if (signup === true && !partnername) {
    e.message = 'Your partner\'s email address is required.'
  }
  if (e.message) {
    return document.dispatchEvent(e)
  }

  F.login(username, password, partnername, signup)
}

function forgotPassword() {
  const username = Help.$('#username').value

  const e = new CustomEvent('message')
  if (!username) {
    e.message = 'Your email address is required.'
  }
  if (e.message) {
    return document.dispatchEvent(e)
  }
  // reset password only once
  Help.$('#forgot-pw').removeEventListener('click', forgotPassword)
  F.forgotPassword(username)
}

// login
Help.$('#login-btn').addEventListener('click', login)
Help.$('#signup-btn').addEventListener('click', login.bind(null, true))

// display errors/messages
document.addEventListener('message', e => {
  Help.$('.message').innerText = e.message
})

// clear errors on input
Help.$$('input').forEach(el => el.addEventListener('focus', () => {
  const e = new CustomEvent('message')
  e.message = '\u00a0'
  document.dispatchEvent(e)
}) )

// reset password
Help.$('#forgot-pw').addEventListener('click', forgotPassword)

