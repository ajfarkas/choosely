// Login functions for /loginreq route

const db = require('../data')
const uuid = require('node-uuid')

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
    db.get(`username-${data.partnername}`, (err, partnerData) => {
      if (err) {
        return console.error(err)
      }
      partnerID = partnerData ? JSON.parse(partnerData).id : undefined
      ids.partner = partnerID
      db.get(`username-${data.username}`, (err2, userData) => {
        if (err2) {
          return console.error(err2)
        }
        userID = userData ? JSON.parse(userData).id : undefined
        ids.user = userID

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
    db.get(`username-${data.partnername}`, (err, partnerData) => {
      if (err && !err.notFound) {
        return console.error(err)
      }
      const partnerID = partnerData ? JSON.parse(partnerData).id : undefined

      const id = uuid.v4()
      const nameData = {
        id: id,
        email: data.username,
        partners: partnerID ? [partnerID] : []
      }
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