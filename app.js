'strict mode'

const fs = require('fs')
const mime = require('mime')
const app = require('express')()
const config = require('./node/config')
const socket = require('./node/socket')

app.get(/.*/, (req, res) => {
  var file = undefined
  if (req.url === '/') {
    file = __dirname+'/public/index.html'
  } else if (req.url.match('favicon.ico')) {
    return res.end()
  } else {
    file = req.url.replace('/', __dirname+'/public/')
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      return console.error(err)
    }
    res.writeHead(200, {'Content-Type': mime.lookup(file)})
    res.write(data)
    res.end()
  })
})

const server = app.listen(config.port, config.ip)
console.log(`server running on port ${config.port}.`)

socket.createNew(server)