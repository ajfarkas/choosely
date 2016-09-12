'strict mode'

const express = require('express'),
      app = express(),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      // session = require('express-session'),
      config = require('./node/config/main'),
      socket = require('./node/socket')

// configure express app
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(session({
//   name: 'connect.sessionId',
//   secret: 'stupor secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     path: '/',
//     httpOnly: true,
//     secure: false,
//     maxAge: 604800000
//   }
// }))
// app.use(passport.initialize())
// app.use(passport.session())

const router = require('./node/server/routes.js')
router(__dirname, app)

// set up server
const server = app.listen(config.port, config.ip)
console.log(`attempting to run server on port ${config.port}.`)
socket.createNew(server)


