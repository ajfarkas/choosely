const fs = require('fs')
const mime = require('mime')

module.exports = function routes(dir, app, passport) {

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }

  function serveFile(res, file) {
    fs.readFile(`${dir}/public/${file}`, (err, data) => {
      if (err) {
        return console.error(err)
      }
      res.writeHead(200, {'Content-Type': mime.lookup(file)})
      res.write(data)
      res.end()
    })
  }
  // serve application files
  app.get('/', (req, res) => {
    serveFile(res, 'index.html')
  })
  app.get('/login', (req, res) => {
    serveFile(res, 'login.html')
  })
  app.get('/create', isLoggedIn, (req, res) => {
    serveFile(res, 'create.html')
  })
}