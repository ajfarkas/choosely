import getFetch from 'whatwg-fetch'
import es6Promise from 'es6-promise'
import cookie from '../static/js.cookie.js'

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
      // store user/partner ids, redir to list
      const expiry = new Date(Date.now() + 604800000)
      cookie('user_id', JSON.stringify(d), {expires: expiry})
      window.location.pathname = '/create/first'
    })
    .catch( e => console.error(e) )
}

export default F