// Auth functions for /loginreq route

const jwt = require('jsonwebtoken'),
      user = require('../models/user'),
      config = require('../config/main'),
      db = require('../data'),
      uuid = require('node-uuid')

/* generateToken
 * create JSON Web Token
 * Args:
 *   - data: any data to be stored in JWT
*/
const generateToken = data => jwt.sign(data, config.secret, {
  expiresIn: config.tokenExpLen
})

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
          return cb({error: 'That email/password combination is invalid.'})
        }
        return console.error(err2)
      }

      userID = userData._id
      ids.user = userID
      ids.partner = partnerData
        ? partnerData._id
        : userData.partners[data.partnername]

      return cb(ids)
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
Auth.login =(data, cb) => {
  console.log('login attempt.')
  Auth.getIDs(data, ids => {
    const res = {
      token: 'JWT '+generateToken(ids),
      user: ids
    }

    return cb(res)
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
Auth.signup = (data, cb) => {
  console.log('signup', `username-${data.username}`)
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
      user.hashPass(data.password, hash => nameData.hash = hash)

      db.put(`username-${data.username}`, nameData, { valueEncoding: 'json' }, e => {
        if (e) {
          return console.error(e)
        }
        console.log(`put successful: username-${data.username}`)

        const userData = {
          user: id,
          partner: partnerID
        }
        const tokenData = {
          token: 'JWT '+generateToken(userData),
          user: userData
        }
        
        return cb(tokenData)
      })
      
    })

  })
}


module.exports = Auth