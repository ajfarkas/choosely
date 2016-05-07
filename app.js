'strict mode'

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')

const config = require('./node/config')
const socket = require('./node/socket')

// configure express app
app.use(express.static('public'))
app.use(cookieParser())
app.use(session({
  name: 'connect.sessionId',
  secret: 'stupor secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 604800000
  }
}))
app.use(passport.initialize())
app.use(passport.session())

require('./node/server/routes.js')(__dirname, app, passport)

// set up server
const server = app.listen(config.port, config.ip)
console.log(`attempting to run server on port ${config.port}.`)
socket.createNew(server)


