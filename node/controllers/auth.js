// Auth functions for /loginreq route

const jwt = require('jsonwebtoken'),
      user = require('../models/user'),
      config = require('../config/main'),
      db = require('../data'),
      uuid = require('node-uuid'),
      loginErr = 'Your login details could not be verified.'

/* generateToken
 * create JSON Web Token
 * Args:
 *   - data: any data to be stored in JWT
*/
const generateToken = data => jwt.sign(data, config.secret, {
  expiresIn: config.tokenExpLen
})

const extractJWT = req => {
  const auth = req.headers.authorization
  if ( auth && auth.match(/^JWT\s.*/) ) {
    return auth.replace('JWT ', '')
  } else {
    throw new Error('No JWT in headers.')
  }
}

const Auth = {}
/* getIDs
 * get UUID for user and partner
 * Args:
 *   - data (`obj`):
 *     - username (`str`): user email address
 *     - password (`str`): user password
 *     - partnername (`str`): partner email address
 *   - cb (`function`): callback function
*/
Auth.getIDs = (data, cb) => {
  console.log('getIDs', `username-${data.username}`)
  const ids = {}
  db.get(`username-${data.partnername}`, {valueEncoding: 'json'}, (err, partnerData) => {
    if (err && !err.notFound) {
      return console.error(err)
    }

    db.get(`username-${data.username}`, {valueEncoding: 'json'}, (err2, userData) => {
      if (err2) {
        if (err2.notFound) {
          return cb(null, false, {error: loginErr})
        }
        return cb(err2, null)
      }

      userID = userData._id
      ids.user = userID
      ids.partner = partnerData
        ? partnerData._id
        : userData.partners[data.partnername]

      return cb(null, ids)
    })
  })
},
/* login
 * Args:
 *   - data (`obj`):
 *     - username (`str`): user email address
 *     - password (`str`): user password
 *     - partnername (`str`): partner email address
 *   - cb (`function`): callback function
*/
Auth.login =(req, res, cb) => {
  console.log('login attempt.')
  Auth.getIDs(req.body, (err, ids) => {
    if (err) {
      cb(err)
    }

    res.status(200).json({
      token: 'JWT '+generateToken(ids),
      user: ids
    })
  })
},
/* signup
 * create UUID for user and get UUID for partner
 * Args:
 *   - data (`obj`):
 *     - username (`str`): user email address
 *     - password (`str`): user password
 *     - partnername (`str`): partner email address
 *   - cb (`function`): callback function
*/ 
Auth.signup = (req, res, cb) => {
  const data = req.body
  console.log('signup', data, `username-${data.username}`, cb)
  db.get(`usernames-${data.username}`, {valueEncoding: 'json'}, (err, existing) => {
    if (err && !err.notFound) {
      return console.error(err)
    } else if (existing) {
      existentialErr = {error: 'That email address is already in use.'}
      if (typeof cb === 'function') {
        return cb(existentialErr)
      } else {
        return existentialErr
      }
    }

    // check if partner has already signed up
    db.get(`username-${data.partnername}`, {valueEncoding: 'json'}, (pErr, partnerData) => {
      if (pErr && !pErr.notFound) {
        return console.error(pErr)
      }
      const notFound = pErr && pErr.notFound
      const partner = {},
            partnerID = notFound ? uuid.v4() : partnerData._id
      partner[data.partnername] = partnerID
      
      const id = !notFound && partnerData.partners && partnerData.partners[data.username]
        ? partnerData.partners[data.username]
        : uuid.v4()

      const nameData = {
        _id: id,
        email: data.username,
        partners: partner,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
      user.hashPass(data.password, hash => {
        nameData.hash = hash

        db.put(`username-${data.username}`, nameData, { valueEncoding: 'json' }, e => {
          if (e) {
            return cb(e)
          }
          console.log(`put successful: username-${data.username}`)

          const userData = {
            user: id,
            partner: partnerID
          }
          
          res.status(201).json({
            token: 'JWT '+generateToken(userData),
            user: userData
          })
        }) // end db.put

      }) // end user.hashpass
      
    }) // end db.get user

  }) // end db.get partner
}
/*
*/
Auth.jwtAuthWS = () => {
  // do stuff
}


module.exports = Auth