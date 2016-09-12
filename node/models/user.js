// User login/signup functions

const bcrypt = require('bcrypt-nodejs')

const User = {}

// `password` is `string`
User.hashPass = (password, cb) => {
  const SaltFactor = 5

  bcrypt.genSalt(SaltFactor, (err, salt) => {
    if (err) {
      return console.error(err)
    }

    bcrypt.hash(password, salt, null, (errB, hash) => {
      if (errB) {
        return console.error(errB)
      }
      cb(hash)
    })
  })

}
/* `candidate` is user-input password `string`
 * `hashedPass` is saved and hashed password `string`
 * `cb` is callback function, which is passed an `error` and `boolean`
*/
User.comparePass = (candidate, hashedPass, cb) => {
  console.log(`comparepass: ${candidate}, ${hashedPass}`)
  return bcrypt.compare(candidate, hashedPass, (err, isMatch) => {
    if (typeof cb === 'function') {
      if (err) {
        return cb(err)
      }
      return cb(null, isMatch)
    } else {
      if (err) {
        return console.error(err)
      }
      return isMatch
    }
  })
}

module.exports = User
