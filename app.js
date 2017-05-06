'strict mode'

const express = require('express'),
      app = express(),
      // cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      // flash = require('connect-flash'),
      session = require('express-session'),
      config = require('./node/config/main'),
      socket = require('./node/socket')

// configure express app
app.use(express.static('public', {index: null}) )
// app.use(cookieParser(config.secret))
// app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  name: 'connect.sessionId',
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 60000
  }
}))

const router = require('./node/server/routes.js')
router(__dirname, app)

// set up server
const server = app.listen(config.port, config.ip)
console.log(`attempting to run server on port ${config.port}.`)
socket.createNew(server)


