const fs = require('fs')
const mime = require('mime')

module.exports = function routes(dir, app, passport) {
  function isLoggedIn(req, res, next) {
    // if (req.isAuthenticated()) {
    //   return next()
    // }
    // res.redirect('/')
    return next()
  }
  
  // serve application files
  function serveFile(res, file) {
    fs.readFile(`${dir}/public/${file}`, (err, data) => {
      console.log(file)
      if (err) {
        return console.error(err)
      }
      res.writeHead(200, {'Content-Type': mime.lookup(file)})
      res.write(data)
      res.end()
    })
  }
  // logged out html files
  const outsidePages = [
    ['/', 'index.html'],
    ['/login', 'login.html'],
    ['/logout', 'logout.html']
  ]
  outsidePages.forEach(page => 
    app.get(page[0], (req, res) => {
      serveFile(res, page[1])
    })
  )
  // logged in html files
  const insidePages = [
    ['/start', 'start.html'],
    ['/create', 'create.html'],
    ['/choose', 'choose.html']
  ]

  insidePages.forEach(page => {
    app.get(page[0], isLoggedIn, (req, res) => {
      serveFile(res, page[1])
    })
  })

  app.post('/loginreq', (req, res) => {
    req.on('data', d => {
      const data = new Buffer(d).toString()
      const json = JSON.parse(data)
      delete json.password

      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write( JSON.stringify(json) )
      res.end()
    })
  })

  // other files (css, js)
  app.get(/.*/, (req, res) => {
    console.log(dir+req.url)
    fs.readFile(dir+req.url, (err, data) => {
      if (err) {
        return console.error(err)
      }
      res.writeHead(200, {'Content-Type': mime.lookup(req.url)})
      res.write(data)
      res.end()
    })
  })
}