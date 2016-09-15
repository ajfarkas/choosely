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
    .then( res => {
      if (res.status === 400) {
        return res.json()
      } else if (res.status === 401) {
        return res.text()
      }
    })
    .then( d => {
      console.log(d)
      window.RES = d
      // store user/partner ids, redir to list
      const expiry = new Date(Date.now() + 604800000)
      cookie('user_id', JSON.stringify(d), {expires: expiry})

      d.user.dbID = d.user.partner > d.user.user
        ? `${d.user.partner}_${d.user.user}`
        : `${d.user.user}_${d.user.partner}`

      localStorage.token = d.token
      localStorage.userData = JSON.stringify(d.user)

      window.location.pathname = '/create/first'
    })
    .catch( e => console.error(e) )
}

export default F