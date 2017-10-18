const fs = require('fs'),
      mime = require('mime'),
      passportService = require('../controllers/passport'),
      authController = require('../controllers/auth'),
      passport = require('passport'),
      names = require('../api/names'),
      pools = require('../api/pools'),
      brackets = require('../api/brackets')

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
  // email login auth
  const localLogin = (req, res, cb) => {
    return passport.authenticate(
      'local',
      {
        session: false,
        failureFlash: false
      },
      (err) => { // params also: user, info
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
  // jwt login auth
  const jwtLogin = (req, res, path, file) => {
    return passport.authenticate(
      'jwt',
      {
        session: false,
        failureFlash: false
      },
      (data, err) => {
        if (data && err === undefined && path !== '/logout') {
          res.redirect('/create/first')
        } else {
          return serveFile(res, file)
        }
      }
    )(req, res, file)
  }
  // logged in html files
  const insidePages = [
    ['/start', 'start.html'],
    ['/create/:name', 'create.html'],
    ['/choose', 'choose.html'],
    ['/bracket', 'bracket.html'],
    ['/results', 'results.html']
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
    app.get(page[0], (req, res) => {
      console.log('req at ', page[0])
      return jwtLogin(req, res, page[0], page[1]) 
    })
  )

  // login/signup requests
  app.post('/loginreq', localLogin)
  app.post('/signupreq', authController.signup)
  app.post('/forgot', authController.forgotPassword)
  app.post('/resetreq/:token', authController.verifyResetToken, localLogin)
  
  // API requests
  // GET
  app.get('/names/:kind', authController.jwtAuth, names)
  app.get('/pools', authController.jwtAuth, pools)
  app.get('/bracket', authController.jwtAuth, brackets)
  // POST
  app.post('/names/:kind', authController.jwtAuth, names)
  app.post('/pools', authController.jwtAuth, pools)
  app.post('/bracket', authController.jwtAuth, brackets)
  // DELETE
  app.delete('/names/:kind', authController.jwtAuth, names)
  app.delete('/pools', authController.jwtAuth, pools)
  app.delete('/bracket', authController.jwtAuth, brackets)

  // other files (css, js)
  app.get(/.*/, (req, res) => {
    console.log('get other files', dir+req.url)
    fs.readFile(dir+req.url, (err, data) => {
      if (err) {
        console.error(`Routes readFile Err: ${JSON.stringify(err)}`)
        serveFile(res, '404.html')
      } else {
        res.writeHead(200, {'Content-Type': mime.lookup(req.url)})
        res.write(data)
        res.end()
      }
    })
  })
}