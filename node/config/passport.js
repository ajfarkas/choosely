const passport = require('passport'),
      passportJWT = require('passport-jwt'),
      user = require('../models/user'),
      config = require('./main'),
      LocalStrategy = require('passport-local'),
      JwtStrategy = passportJWT.Strategy,
      extractJWT = passportJWT.ExtractJwt,
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
  // check auth headers
  jwtFromRequest: extractJWT.fromAuthHeader(),
  secretOrKey: config.secret
}

const jwtLogin = new JwtStrategy(jwtOpts, (info, cb) => {
  console.log('JWT login ', info)
  // check for user in db
  //TODO: update info.user to info.email
  db.get(`username-${info.user}`, { valueEncoding: 'json' }, (err, data) => {
    console.log('data: ', err, data)
    if (err) {
      if (err.notFound) {
        return cb({ status: 401, error: loginErr })
      } else {
        return console.error(`jwtLogin get ERR: ${JSON.stringify(err)}`)
      }
    }
    if (data.partners.indexOf(info.partner) < 0) {
      return cb({ status: 401, error: loginErr })
    } else {
      return cb(null, data)
    }
  })
})

passport.use(localLogin)
passport.use(jwtLogin)
