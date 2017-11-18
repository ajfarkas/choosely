'use strict'

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      config = require('./node/config/main')

// configure express app
app.use(express.static('public', {index: null}) )
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
app.listen(config.port, config.ip)
console.log(`***Running server on port ${config.port}.***`)
