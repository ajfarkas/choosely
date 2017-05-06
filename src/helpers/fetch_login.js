import getFetch from 'whatwg-fetch'
import Cookies from 'js-cookie'
import es6Promise from 'es6-promise'

// init Promise for IE and maybe FF
es6Promise.polyfill()

const F = {}

// Login and signup function
F.login = (username, password, partnername, signup) => {
  const path = signup === true ? 'signupreq' : 'loginreq'
  const req = new Request(`${location.origin}/${path}`, {
    method: 'post',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    credentials: 'same-origin',
    body: JSON.stringify({
      username: username,
      password: password,
      partnername: partnername
    })
  })

  fetch(req)
    .then( res => res.json() )
    .then( d => {
      if (d.error) {
        const e = new CustomEvent('message')
        e.message = d.error
        return document.dispatchEvent(e)
      }
      // store JWT and redirect
      Cookies.set('cjwt', d.token.replace('JWT ', ''), { expires: 7 })

      window.location.pathname = '/create/first'
    })
    .catch( e => console.error(e) )
}

// Forgot Password function
F.forgotPassword = email => {
  const req = new Request(`${location.origin}/forgot`, {
    method: 'post',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    credentials: 'same-origin',
    body: JSON.stringify({
      username: email
    })
  }) 

  fetch(req)
    .then( res => res.json() )
    .then( d => {
      if (d.message || d.error) {
        const e = new CustomEvent('message')
        e.message = d.message || d.error
        return document.dispatchEvent(e)
      }
    })
    .catch( e => console.error(e) )
}

// Reset password function
F.resetPassword = (email, password) => {
  const token = location.pathname.match(/reset\/(.*)/)[1]
  const req = new Request(`${location.origin}/resetreq/${token}`, {
    method: 'post',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    credentials: 'same-origin',
    body: JSON.stringify({
      username: email,
      password: password
    })
  })

  fetch(req)
    .then( res => res.json() )
    .then( d => {
      if (d.message || d.error) {
        const e = new CustomEvent('message')
        e.message = d.message || d.error
        return document.dispatchEvent(e)
      } else {
        F.login(email, password)
      }
    })
    .catch( e => console.error(e) )
}

export default F