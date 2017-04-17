const fs = require('fs'),
      mime = require('mime'),
      passportService = require('../config/passport'),
      authController = require('../controllers/auth'),
      passport = require('passport'),
      names = require('../api/names'),
      pools = require('../api/pools'),
      brackets = require('../api/brackets')

const localLogin = (req, res, cb) => {
  console.log('localLogin!')
  return passport.authenticate(
    'local',
    {
      session: false,
      failureFlash: false
    },
    (err, user, info) => {
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
    console.log('servefile: ', file)
    fs.readFile(`${dir}/public/${file}`, (err, data) => {
      if (err) {
        return console.error(`Routes serveFile err: ${JSON.stringify(err)}`)
      }
      res.writeHead(200, {'Content-Type': mime.lookup(file)})
      res.write(data)
      res.end()
    })
  }
  // logged in html files
  const insidePages = [
    ['/start', 'start.html'],
    ['/create/:name', 'create.html'],
    ['/choose', 'choose.html']
  ]
  insidePages.forEach(page => {
    app.get(page[0], (req, res) =>
      serveFile(res, page[1])
    )
  })

  // logged out html files
  const outsidePages = [
    ['/', 'index.html'],
    ['/login', 'index.html'],
    ['/logout', 'index.html'],
    ['/reset/:token', 'reset.html']
  ]
  outsidePages.forEach(page => 
    app.get(page[0], (req, res) =>
      serveFile(res, page[1])
    )
  )

  // login/signup requests
  app.post('/loginreq', localLogin)
  app.post('/signupreq', authController.signup)
  app.post('/forgot', authController.forgotPassword)
  app.post('/resetreq/:token', authController.verifyResetToken, localLogin)
  
  // API requests
  // GET
  app.get('/names/:op/:kind/', authController.jwtAuth, names)
  app.get('/pools/:op/', authController.jwtAuth, pools)
  app.get('/bracket/:op/', authController.jwtAuth, brackets)
  // POST
  app.post('/names/:op/:kind/', authController.jwtAuth, names)
  app.post('/pools/:op/', authController.jwtAuth, pools)
  app.post('/bracket/:op/', authController.jwtAuth, brackets)

  // other files (css, js)
  app.get(/.*/, (req, res) => {
    console.log('get other files', dir+req.url)
    fs.readFile(dir+req.url, (err, data) => {
      if (err) {
        console.error(`Routes readFile Err: ${JSON.stringify(err)}`)
        res.writeHead(404, {'Content-type': 'text/html'})
        res.write('<h1>404: This File does not exist.</h1>')
        res.end()
      } else {
        res.writeHead(200, {'Content-Type': mime.lookup(req.url)})
        res.write(data)
        res.end()
      }
    })
  })
}