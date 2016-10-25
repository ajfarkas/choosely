const fs = require('fs'),
      mime = require('mime'),
      passportService = require('../config/passport'),
      authController = require('../controllers/auth'),
      passport = require('passport'),
      names = require('../api/names')

const localLogin = (req, res, cb) => {
  console.log('localLogin')
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

// const jwtLogin = (req, res, cb) => {
//   console.log('jwtLogin')
//   return passport.authenticate(
//     'jwt',
//     {
//       session: true,
//       failureFlash: false
//     },
//     (err, user, info) => {
//       if (err) {
//         if (err.status) {
//           res.status(err.status).json(err)
//         } else {
//           res.status(500).json(err)
//         }
//       } else {
//         console.log('jwt good to go')
//         cb(req, res)
//       }
//     }
//   )(req, res)
// }

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
  // logged in html files
  const insidePages = [
    ['/start', 'start.html'],
    ['/create/*', 'create.html'],
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
  app.get('/names/:op/:kind/', names)

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