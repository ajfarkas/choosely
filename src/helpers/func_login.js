import getFetch from 'whatwg-fetch'
import es6Promise from 'es6-promise'

import Help from './helpers'

// init Promise for IE and maybe FF
es6Promise.polyfill()

const F = {}

F.login = (username, password, partnername) => {
  const req = new Request(`${location.origin}/loginreq`, {
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
    .then( d => console.log(d) )
    .catch( e => console.error(e) )
}

export default F