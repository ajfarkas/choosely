const Op = {},
      db = require('../data'),
      Help = require('./helpers'),
      jwtDecode = require('jwt-decode')

/* Read Bracket
 * Return array of pools associated with team account.
 * method: 'get'
 * req.headers:
 *  - Authorization: JSON web token
 * response:
 *  - `Arr` containing pool IDs
*/      
Op.read = (req, res) => {
  const jwt = jwtDecode( req.headers.authorization.replace(/^JWT\s/, '') )
  const team = Help.getTeamID(jwt)

  db.get(`${team}_bracket`, { valueEncoding: 'json' }, (err, bracket) => {
    if (err) {
      if (err.notFound) {
        let names = {}
        // create bracket
        db.createValueStream({gte: `${team}_firstname_`, lte: `${team}_firstname_\xff`, valueEncoding: 'json'})
          .on('error', readErr => {
            console.error(`readBracket/create/readNames: ${readErr}`)
            res.status(500).json(readErr)
          })
          .on('data', name => {
            names[name.id] = name
          })
          .on('end', () => {
            // remove eliminated names
            const nameArr = Object.keys(names).filter(name => {
              return !names[name][jwt.user].eliminated
            })
            console.log('readBracket nameArr:',nameArr)
            // sort names, alternating best/worst seed
            nameArr.sort((a, b) => {
              const users = team.split('_')
              const matchesA = users.reduce((c, d) => {
                return (Object.keys(names[a][c].matches).length + Object.keys(names[a][d].matches).length)
              })
              const matchesB = users.reduce((c, d) => {
                return (Object.keys(names[b][c].matches).length + Object.keys(names[b][d].matches).length)
              })
              const scoreA = users.reduce((c, d) => {
                return (names[a][c].score + names[a][d].score)
              })
              const scoreB = users.reduce((c, d) => {
                return (names[b][c].score + names[b][d].score)
              })

              return scoreA/matchesA > scoreB/matchesB
            })
            // match hi seed to low seed, rm bye
            for (; nameArr.length > 1;) {
              bracket.push([
                nameArr.shift(),
                nameArr.pop()
              ])
            }

            console.log('bracket created')
            db.put(`${team}_bracket`, bracket, { valueEncoding: 'json' }, (putErr) => {
              if (putErr) {
                console.error(`bracketRead/put: ${putErr}`)
                res.status(500).json(puErr)
              } else {
                res.status(201).json(bracket)
              }
            })
          })
      } else {
        console.error(`readBracket read Error: ${err}`)
        res.status(500).json(putErr)
      }
    } else {
      res.status(200).json(bracket)
    }
  })
}

module.exports = (req, res, cb) => {
  Op[req.params.op](req, res, cb)
}