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
  const jwt = jwtDecode( Help.getCookies(req).cjwt )
  const team = Help.getTeamID(jwt)

  db.get(`${team}_pools`, { valueEncoding: 'json' }, (err, poolData) => {
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
                  namesUsed = {},
                  matches = [],
                  pools = []
            let challengeArr = undefined,
                nameIndex = 0,
                contestant = undefined,
                contests = undefined,
                challenger = undefined,
                challengeIndex = undefined,
                poolNum = undefined

            for (; nameIndex < namesLen; nameIndex++) {
              contestant = idArray.shift()
              challengeArr = idArray.concat()
              contests = namesUsed[contestant] || 0

              for (; contests < poolSize - 1;) {
                challengeIndex = Math.floor(Math.random() * idArray.length)
                challenger = challengeArr.length
                  ? challengeArr.splice(challengeArr[challengeIndex], 1)[0]
                  : Object.keys(names)[poolSize - contests] 

                matches.push([ contestant, challenger ])

                namesUsed[contestant] = contests++ + 1
                namesUsed[challenger] = namesUsed[challenger]
                  ? namesUsed[challenger]++ + 1
                  : 1

                if (nameIndex % poolSize === 0) {
                  poolNum = Math.floor(nameIndex / poolSize)
                  if (!pools[poolNum]) {
                    pools[poolNum] = []
                  }
                  if (pools[poolNum].indexOf(contestant) === -1) {
                    pools[poolNum].push(contestant)
                  }
                  pools[poolNum].push(challenger)
                }
              }
            }

            console.log('pool created')
            db.put(
              `${team}_pools`,
              { pools: pools, matches: matches},
              { valueEncoding: 'json'},
              (putErr) => {
                if (putErr) {
                  console.error(`poolRead/put: ${putErr}`)
                  res.status(500).json({ error: putErr })
                } else {
                  res.status(201).json({ pools: pools, matches: matches})
                }
              }
            )
          })
      } else {
        console.error(`readPool read Error: ${err}`)
        res.status(500).json({ error: err })
      }
    } else {
      res.status(200).json(poolData)
    }
  })
}
/* Update Pools
 * update user-partner pools.
 * method: 'post'
 * req.headers:
 *   - Authorization: JSON web token
 * req.body: (`arr`) pool match data (Data.matches)
 * response:   
 *   - `Arr` of arrays or uuid pairs
*/
Op.update = (req, res) => {
  const jwt = jwtDecode( Help.getCookies(req).cjwt ),
        team = Help.getTeamID(jwt)

  db.get(`${team}_pools`, {valueEncoding: 'json'}, (getErr, data) => {
    if (getErr) {
      console.error('read DB error on update pools', getErr)
      res.status(500).json({ error: getErr })
    } else {
      const poolData = Object.assign(data, {matches: req.body})

      db.put(`${team}_pools`, poolData, { valueEncoding: 'json' }, putErr => {
        if (putErr) {
          res.status(500).json({ error: putErr })
        } else {
          res.status(200).json(poolData)
        }
      })
    }
  })
}
/* Delete Pools
 * clear user-partner pools.
 * method: 'delete'
 * req.headers:
 *   - Authorization: JSON web token
 * response:   
 *   - `Arr` (empty)
*/
Op.delete = (req, res) => {
  const jwt = jwtDecode( Help.getCookies(req).cjwt ),
        team = Help.getTeamID(jwt)

  db.del(`${team}_pools`, { valueEncoding: 'json' }, err => {
    if (err) {
      res.status(500).json({ error: err })
    } else {
      res.status(200).json([])
    }
  })
}

module.exports = (req, res, cb) => {
  Op[req.params.op](req, res, cb)
}