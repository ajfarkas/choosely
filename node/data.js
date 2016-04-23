const config = require('./config')
const promise = require('bluebird')
const levelup = promise.promisify( require('levelup') )

const db = levelup(config.db)
  .then(console.log)
  .catch(console.error)

