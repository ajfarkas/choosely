import init from './helpers/init'
import Help from './helpers/helpers'
import F from './helpers/fetch_login'

init()

function login(signup) {  
  const username = Help.$('#username')
  const password = Help.$('#password')
  const partnername = Help.$('#partnername')
  
  const e = new CustomEvent('message')
  if (!username.value || !username.checkValidity()) {
    e.message = 'A valid email address is required.'
  } else if (!password.value || !password.checkValidity()) {
    e.message = 'A valid password is required.'
  } else if (signup === true && (!partnername.value || !partnername.checkValidity())) {
    e.message = 'Your partner\'s valid email address is required.'
  }
  if (e.message) {
    return document.dispatchEvent(e)
  }

  F.login(username.value, password.value, partnername.value, signup)
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

