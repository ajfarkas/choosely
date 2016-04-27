const config = require('./config')
const levelup = require('levelup')

module.exports = levelup(config.db)