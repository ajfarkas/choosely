// Auth functions for /loginreq route

const jwt = require('jsonwebtoken'),
      user = require('../models/user'),
      config = require('../config/main'),
      db = require('../data'),
      uuid = require('node-uuid')

const generateToken = userID => jwt.sign(userID, config.secret, {
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
*/
Auth.getIDs = (data, cb) => {
  console.log('getIDs', `username-${data.username}`)
  const ids = {}
  db.get(`username-${data.partnername}`, {valueEncoding: 'json'}, (err, partnerData) => {
    if (err) {
      return console.error(err)
    }
    partnerID = partnerData ? partnerData._id : undefined
    ids.partner = partnerID
    db.get(`username-${data.username}`, {valueEncoding: 'json'}, (err2, userData) => {
      if (err2) {
        return console.error(err2)
      }
      userID = userData ? userData._id : undefined
      ids.user = userID

      if (typeof cb === 'function') {
        cb(ids)
      } else {
        return ids
      }
    })
  })
},
/* login
 * Args:
 *   - data (`obj`):
 *     - username (`str`): user email address
 *     - password (`str`): user password
 *     - partnername (`str`): partner email address
*/
Auth.login =(data, cb) => {
  console.log('login attempt.')
  const ids = Auth.getIDs(data)
  const res = {
    token: 'JWT '+generateToken(ids),
    user: ids
  }

  if (typeof cb === 'function') {
    cb(res)
  } else {
    return res
  }
},
/* signup
 * create UUID for user and get UUID for partner
 * Args:
 *   - data (`obj`):
 *     - username (`str`): user email address
 *     - password (`str`): user password
 *     - partnername (`str`): partner email address
*/ 
Auth.signup = (data, cb) => {
  console.log('signup', `username-${data.username}`)
  // check if partner has already signed up
  db.get(`username-${data.partnername}`, {valueEncoding: 'json'}, (err, partnerData) => {
    if (err && !err.notFound) {
      return console.error(err)
    }
    const notFound = err && err.notFound
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

    console.log(nameData)
    db.put(`username-${data.username}`, nameData, { valueEncoding: 'json' }, e => {
      if (e) {
        return console.error(e)
      } else if (typeof cb === 'function') {
        cb({
          user: id,
          partner: partnerID
        })
      }
    })
  })
}


module.exports = Auth