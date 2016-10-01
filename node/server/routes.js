const fs = require('fs'),
      mime = require('mime'),
      passportService = require('../config/passport'),
      authController = require('../controllers/auth'),
      passport = require('passport')

const localLogin = (req, res, cb) => {
  console.log('localLogin')
  return passport.authenticate(
    'local',
    {
      session: false,
      failureFlash: false
    },
    (err, user, info) => {
      console.log(err, user, info)
      if (err) {
        if (err.status) {
          res.status(err.status).json(err)
        } else {
          res.status(500).json(err)
        }
      } else {
        authController.login(req, res, cb)
      }
    }
  )(req, res, cb)
}

module.exports = function routes(dir, app) {
  // serve application files
  function serveFile(res, file) {
    console.log(file)
    fs.readFile(`${dir}/public/${file}`, (err, data) => {
      if (err) {
        return console.error(`Routes serveFile err: ${JSON.stringify(err)}`)
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
    ['/create/*', 'create.html'],
    ['/choose', 'choose.html']
  ]

  insidePages.forEach(page => {
    app.get(page[0], (req, res) => {
      serveFile(res, page[1])
    })
  })

  app.post('/loginreq', localLogin)
  
  app.post('/signupreq', authController.signup)
  

  // other files (css, js)
  app.get(/.*/, (req, res) => {
    console.log(dir+req.url)
    fs.readFile(dir+req.url, (err, data) => {
      if (err) {
        return console.error(`Routes readFile Err: ${JSON.stringify(err)}`)
      }
      res.writeHead(200, {'Content-Type': mime.lookup(req.url)})
      res.write(data)
      res.end()
    })
  })
}