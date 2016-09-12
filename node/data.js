const config = require('./config/main')
const levelup = require('levelup')

module.exports = levelup(config.db)