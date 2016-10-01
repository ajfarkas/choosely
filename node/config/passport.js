const passport = require('passport'),
      // passportJWT = require('passport-jwt'),
      user = require('../models/user'),
      // config = require('./main'),
      LocalStrategy = require('passport-local'),
      // jwtStrategy = passportJWT.Strategy,
      // extractJWT = passportJWT.ExtractJwt,
      db = require('../data')

const localOpts = { },
      loginErr = 'Your login details could not be verified.'

const localLogin = new LocalStrategy(localOpts, (email, password, cb) => {
  console.log('locallogin', email)
  // call user info from database and use comparePass from models/user.
  return db.get(`username-${email}`, { valueEncoding: 'json' }, (err, data) => {
    console.log('local login get db')
    if (err) {
      console.log('err1: ', err)
      if (err.notFound) {
        return cb({ status: 401, error: loginErr })
      } else {
        return console.error('localLogin, passport.js: ', err)
      }
    }

    user.comparePass(password, data.hash, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('comparePass err: ', compareErr)
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

// const jwtOpts = {
//   // check auth headers
//   jwtFromRequest: extractJWT.fromAuthHeader(),
//   secretOrKey: config.secret
// }

// const jwtLogin = undefined

passport.use(localLogin)
