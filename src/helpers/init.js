import getFetch from 'whatwg-fetch'
import Cookies from 'js-cookie'
import es6Promise from 'es6-promise'
import jwtDecode from 'jwt-decode'
import Names from './fetch_names'

// init Promise for IE and maybe FF
es6Promise.polyfill()

export default function init(cb) {
  // check for jwt
  const token = Cookies.get('cjwt')
  let decoded = null
  if (token) {
    try {
      decoded = jwtDecode(token)
    } catch(e) {
      console.warn(e)
    }
  }

  if (location.pathname.match(/^$|^\/$|^\/login$|^\/logout$/)) {
    return false
  } else if (!decoded || decoded.exp <= Date.now()/1000) {
    Cookies.remove('cjwt')
    return location.pathname = '/login'
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
  ; Names.read('first', firsts => {
    Data.firstnames = firsts
    Names.read('last', lasts => {
      Data.lastnames = lasts
      if (typeof cb === 'function') {
        cb()
      }
    })
  })
}
