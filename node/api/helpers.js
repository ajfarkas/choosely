// Backend API Helper Functions
const emailCheck = require('email-check')

module.exports = {
  // get ID used to store couple data in DB
  getTeamID: jwt => {
    return jwt.partner > jwt.user
      ? `${jwt.partner}_${jwt.user}`
      : `${jwt.user}_${jwt.partner}`
  },

  getCookies: req => {
    const cookies = {}
    
    req.headers.cookie.split('; ').forEach(cookie => {
      const data = cookie.split('=')
      cookies[data[0]] = data[1]
    })

    return cookies
  },
  /* Validate.email
   *
   * @params:
   *  email {String}: string to test as valid email
   *  cb {Function}: optional callback function
   *
   * @returns:
   *  Boolean or callback with (error, Boolean)
  */
  validateEmail: (email, cb) => {
    emailCheck(email, { timeout: 2000 })
      .then(res => {
        if (typeof cb === 'function') {
          cb(null, res)
        } else {
          return res
        }
      })
      .catch(err => {
        if (typeof cb === 'function') {
          cb(err, false)
        } else {
          return false
        }
      })
  }
}