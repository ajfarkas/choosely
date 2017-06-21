const passport = require('passport'),
      passportJWT = require('passport-jwt'),
      user = require('../models/user'),
      config = require('../config/main'),
      LocalStrategy = require('passport-local'),
      JwtStrategy = passportJWT.Strategy,
      db = require('../data')

const localOpts = { },
      loginErr = 'Your login details could not be verified.'

const localLogin = new LocalStrategy(localOpts, (email, password, cb) => {
  console.log('local login (pp) ', localOpts)
  // call user info from database and use comparePass from models/user.
  return db.get(`username-${email}`, { valueEncoding: 'json' }, (err, data) => {
    if (err) {
      if (err.notFound) {
        return cb({ status: 401, error: loginErr })
      } else {
        return console.error(`login get user ERR: ${JSON.stringify(err)}`)
      }
    }

    user.comparePass(password, data.hash, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('comparePass ERR: ', compareErr)
        return cb(compareErr)
      }
      if (isMatch) {
        return cb(null, data)
      } else {
        return cb({ status: 401, error: loginErr })
      }
    })
  })
})

const jwtOpts = {
  secretOrKey: config.secret,
  jwtFromRequest: req => {
    const token = req.headers.cookie
      ? req.headers.cookie.match(/cjwt\=((\w\.?)+)\;?\b/)
      : null
    return token && token[1] ? token[1] : null
  }
}

const jwtLogin = new JwtStrategy(jwtOpts, (token, cb) => {
  if (token) {
    return cb(token)
  } else {
    return cb(null, { status: 401, error: loginErr })
  }
})

passport.use(localLogin)
passport.use(jwtLogin)
