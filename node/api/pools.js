const Op = {},
      db = require('../data'),
      Help = require('./helpers'),
      jwtDecode = require('jwt-decode'),
      poolSize = 4

/* Read Pool
 * Return array of pool objects associated with team account.
 * method: 'get'
 * req.headers:
 *  - Authorization: JSON web token
 * response:
 *  - `Arr` containing pool `Objects`
*/      
Op.read = (req, res) => {
  const jwt = jwtDecode( req.headers.authorization.replace(/^JWT\s/, '') )
  const team = Help.getTeamID(jwt)

  db.get(`${team}_pools`, { valueEncoding: 'json' }, (err, pools) => {
    if (err) {
      if (err.notFound) {
        // create Pool
        console.log('creating new pool.')
        let names = {}

        db.createValueStream({gte: `${team}_firstname_`, lte: `${team}_firstname_\xff`, valueEncoding: 'json'})
          .on('error', readErr => {
            console.error(`readPool/create/readNames: ${readErr}`)
            res.status(500).json({ error: readErr })
          })
          .on('data', name => {
            names[name.id] = name
          })
          .on('end', () => {
            console.log('pools read firstname', names)
            const idArray = Object.keys(names),
                  namesLen = idArray.length,
                  namesUsed = {}
            let challengeArr = undefined,
                nameIndex = 0,
                contestant = undefined,
                contests = undefined,
                challenger = undefined,
                challengeIndex = undefined
            pools = []

            for (; nameIndex < namesLen; nameIndex++) {
              contestant = idArray.shift()
              challengeArr = idArray.concat()
              contests = namesUsed[contestant] || 0

              for (; contests < poolSize - 1;) {
                challengeIndex = Math.floor(Math.random() * idArray.length)
                challenger = challengeArr.length
                  ? challengeArr.splice(challengeArr[challengeIndex], 1)[0]
                  : Object.keys(names)[poolSize - contests] 

                pools.push([ contestant, challenger ])

                namesUsed[contestant] = contests++ + 1
                namesUsed[challenger] = namesUsed[challenger]
                  ? namesUsed[challenger]++ + 1
                  : 1
              }
            }

            console.log('pool created', pools)
            db.put(`${team}_pools`, pools, { valueEncoding: 'json'}, (putErr) => {
              if (putErr) {
                console.error(`poolRead/put: ${putErr}`)
                res.status(500).json({ error: putErr })
              } else {
                res.status(201).json(pools)
              }
            })
          })
      } else {
        console.error(`readPool read Error: ${err}`)
        res.status(500).json({ error: err })
      }
    } else {
      res.status(200).json(pools)
    }
  })
}
/* Update Pools
 * update user-partner pools.
 * method: 'post'
 * req.headers:
 *   - Authorization: JSON web token
 * req.body: (`arr`) pools data
 * response:   
 *   - `Arr` of arrays or uuid pairs
*/
Op.update = (req, res) => {
  const jwt = jwtDecode( req.headers.authorization.replace(/^JWT\s/, '') ),
        team = Help.getTeamID(jwt),
        pools = req.body

  db.put(`${team}_pools`, pools, { valueEncoding: 'json' }, err => {
    if (err) {
      res.status(500).json({ error: err })
    } else {
      res.status(200).json(pools)
    }
  })
}

module.exports = (req, res, cb) => {
  Op[req.params.op](req, res, cb)
}