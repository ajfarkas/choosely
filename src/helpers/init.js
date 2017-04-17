import getFetch from 'whatwg-fetch'
import es6Promise from 'es6-promise'
import jwtDecode from 'jwt-decode'
import Names from './fetch_names'

// init Promise for IE and maybe FF
es6Promise.polyfill()

export default function init(cb) {
  // check for jwt
  const token = localStorage.token
  const decoded = token
    ? jwtDecode( token.replace('JWT ', '') )
    : null

  if (!location.pathname.match(/^\/$|^\/login$|^\/logout$/)) {
    if (!decoded || decoded.exp <= Date.now()/1000) {
      localStorage.clear()
      return location.pathname = '/login'
    }
  } else {
    return false
  }
 
  window.Data = {
    user: {
      user: decoded.user,
      partner: decoded.partner,
      dbID: decoded.partner > decoded.user
        ? `${decoded.partner}_${decoded.user}`
        : `${decoded.user}_${decoded.partner}`
    },
    firstnames: {},
    lastnames: {},
    pools: [],
    bracket: []
  }

   // get all names from DB
  ;['first', 'last'].forEach(whichName => {
    Names.read(whichName, data => {
      Data[`${whichName}names`] = data
      if (whichName === 'last' && cb) {
        cb()
      }
    })
  })

// TODO: remove socket.io
  window.socket = io()

  socket.on('connect', () => {
    console.log('socket connected.')
  }).on('disconnect', () => {
    console.log('socket disconnected.')
  })
  
}