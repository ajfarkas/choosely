import getFetch from 'whatwg-fetch'
import es6Promise from 'es6-promise'
import jwtDecode from 'jwt-decode'

// init Promise for IE and maybe FF
es6Promise.polyfill()

export default function initSocket(cb) {
  // check for jwt
  const token = localStorage.token
  const decoded = token
    ? jwtDecode( token.replace('JWT ', '') )
    : null

  if (!location.pathname.match(/^\/$|^\/login$|^\/logout$/)) {
    if (!decoded) {
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
    names: {},
    lastnames: {},
    pools: [],
    bracket: []
  }
// TODO: remove socket.io
  window.socket = io()

  socket.on('connect', () => {
    console.log('socket connected.')
  }).on('disconnect', () => {
    console.log('socket disconnected.')
  })
  
  if (cb) {
    return cb()
  }
}