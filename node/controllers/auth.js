// Auth functions for /loginreq route

const jwt = require('jsonwebtoken'),
      user = require('../models/user'),
      config = require('../config/main'),
      db = require('../data'),
      uuid = require('node-uuid'),
      crypto = require('crypto'),
      mail = require('./mail'),
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

  db.get(`username-${data.username}`, {valueEncoding: 'json'}, (err2, userData) => {
    if (err2) {
      if (err2.notFound) {
        return cb({
          status: 401,
          message: loginErr
        })
      }
      return cb(err2, null)
    }
 
    const ids = {
      user: userData._id,
      partner: data.partnername
      ? userData.partners[data.partnername]
      : userData.partners[Object.keys(userData.partners)[0]]
    }

    return cb(null, ids)
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
      console.log(`Auth.login Err: ${JSON.stringify(err)}`)
      if (err.status) {
        return res.status(err.status).json(err)
      } else {
        return cb(err)
      }
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
  console.log('signup', `username-${data.username}`)
  db.get(`username-${data.username}`, {valueEncoding: 'json'}, (err, existing) => {
    if (err && !err.notFound) {
      return console.error(err)
    } else if (existing) {
      console.log('user already exists')
      existentialErr = {error: 'That email address is already in use.'}
      return res.status(409).json(existentialErr)
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
      
    }) // end db.get partner

  }) // end db.get user
}
/*
*/
Auth.jwtAuthWS = () => {
  // do stuff
}

/* Forgot Password
*/
Auth.forgotPassword = (req, res, cb) => {
  const email = req.body.username
  console.log(`forgotPassword ${email}`)

  db.get(`username-${email}`, { valueEncoding: 'json'}, (e, data) => {
    if (e) {
      console.error(`Auth.forgotPassword Err: ${JSON.stringify(e)}`)
      return res.status(422).json({ error: 'Your request could not be processed as entered. Plase try again.' })
    }

    crypto.randomBytes(48, (err, buf) => {
      if (err) {
        return cb(err)
      }

      const resetToken = buf.toString('hex')

      data.resetPasswordToken = resetToken
      data.resetPasswordExpires = Date.now() + 600000 // 10 minutes

      db.put(`username-${email}`, data, { valueEncoding: 'json' }, putErr => {
        if (putErr) {
          return cb(putErr)
        }

        const msg = {
          to: email,
          subject: 'Choosely: Reset Password',
          text: 'You\'re receiving this email because you (or someone else) requested that your accound password be reset.\n\n'+
            'Follow this link to complete the password reset process:\n\n'+
            'http://'+req.headers.host+'/reset/'+resetToken+'\n\n'+
            'If you didn\'t request a reset, simply ignore this message.'
        }

        mail.send(msg)
        cb()
      }) // end put
    }) // end crypto
  }) // end get
}


module.exports = Auth