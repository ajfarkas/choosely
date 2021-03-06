import Help from './helpers/helpers'
import F from './helpers/fetch_login'

function resetPassword() {
  const username = Help.$('#username').value,
        password = Help.$('#password').value
  // reset only once
  Help.$('#reset-btn').removeEventListener('click', resetPassword)
  F.resetPassword(username, password)
}

// reset password
Help.$('#reset-btn').addEventListener('click', resetPassword)

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
