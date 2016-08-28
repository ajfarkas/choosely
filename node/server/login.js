// Login functions for /loginreq route

// const user = require('../models/user'),
const db = require('../data'),
      uuid = require('node-uuid')

const login = {
  /* Login
   * get UUID for user and partner
   * Args:
   *   - data (`obj`):
   *     - username (`str`): user email address
   *     - password (`str`): user password
   *     - partnername (`str`): partner email address
  */
  getIds(data, cb) {
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
        console.log(userData)

        if (typeof cb === 'function') {
          cb(ids)
        } else {
          return ids
        }
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
  */ 
  signup(data, cb) {
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
        partners: partner
      }
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
}

module.exports = login