import getFetch from 'whatwg-fetch'
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
        const e = new CustomEvent('error')
        e.message = d.error
        return document.dispatchEvent(e)
      }
      // store user/partner ids, redir to list
      d.user.dbID = d.user.partner > d.user.user
        ? `${d.user.partner}_${d.user.user}`
        : `${d.user.user}_${d.user.partner}`

      localStorage.token = d.token
      localStorage.userData = JSON.stringify(d.user)

      window.location.pathname = '/create/first'
    })
    .catch( e => console.error(e) )
}

// Reset Password function
F.resetPassword = (email) => {
  const req = new Request(`${location.origin}/forgot`, {
    method: 'post',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      username: email
    })
  }) 

  fetch(req)
    .then( res => res.json() )
    .then( d => {
      console.log(d)
    })
    .catch( e => console.error(e) )
}

export default F