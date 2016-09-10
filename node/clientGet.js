// All DB READ functions

const db = require('./data')

const poolSize = 4

const get = {}

/* Read Names
 * Return all names associated with user account.
 * Args: data (`Obj`)
 *   - verb: 'read'
 *   - subject: 'names'
 *   - user: user joined with partner uuid by `_`
*/
get.readNames = (client, data, cb) => {
  const names = {}

  db.createValueStream({gte: `${data.user}_name_`, lte: `${data.user}_name_\xff`, valueEncoding: 'json'})
    .on('error', err => console.error(`readNames: ${err}`))
    .on('data', d => {
      if (Object.keys(names).indexOf(d.id) === -1) {
        names[d.id] = d
      }
    })
    .on('end', () => {
      console.log(names)
      if (typeof cb === 'function') {
        cb(names)
      } else {
        client.emit('namesRead', names)
      }
    })
}
/* Read Pool
 * Return array of pools associated with user account.
 * Args: data (`Obj`)
 *   - verb: 'read'
 *   - subject: 'pool'
 *   - user: user joined with partner uuid by `_`
*/
get.readPool = (client, data, forceRefresh) => {
  console.log(data)
  db.get(`${data.user}_pools`, { valueEncoding: 'json' }, (err, pools) => {
    if (err && err.notFound || forceRefresh) {
      // create Pool
      console.log('creating new pool.')
      get.readNames(client, data, names => {
        const idArray = Object.keys(names)
        const namesLen = idArray.length
        const namesUsed = {}
        var challengeArr = undefined,
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
        client.emit('poolRead', pools)
        db.put(`${data.user}_pools`, pools, { valueEncoding: 'json' }, err2 => {
          if (err2) {
            return console.error(`poolCreate: ${err2}`)
          }
          console.log(pools)
        })
      })
    } else if (err) {
      return console.error(`readPool: ${err}; ${pools}`)
    } else {
      console.log('read stored pool')
      client.emit('poolRead', pools)
    }
  })
}

/* Read Bracket
 * Return array of pools associated with user account.
 * Args: data (`Obj`)
 *   - verb: 'read'
 *   - subject: 'bracket'
 *   - user: user joined with partner uuid by `_`
*/
get.readBracket = (client, data, forceRefresh) => {
  db.get(`${data.user}_bracket`, { valueEncoding: 'json' }, (err, bracket) => {
    if (err && err.notFound || forceRefresh) {
      // create bracket
      console.log('creating new bracket.')
      bracket = []

      get.readNames(client, data, names => {
        nameArr = Object.keys(names)
        // sort names, alternating best/worst seed
        nameArr.sort((a, b) => {
          const users = data.user.split('_')
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

        for (; nameArr.length > 0;) {
          bracket.push([
            nameArr.shift(),
            nameArr.pop()
          ])
        }

        console.log('bracket created', bracket)
        // client.emit('bracketRead', bracket)
        // db.put(`${data.user}_bracket`, bracket, { valueEncoding: 'json' }, err2 => {
        //   if (err2) {
        //     return console.error(err2)
        //   }
        // })
      })
      
    } else if (err) {
      return console.error(err)
    } else {
      console.log('read stored bracket')
      client.emit('bracketRead', bracket)
    }
  })
}

get.error = func => {
  console.error(`${func} is not a socket.get function.`)
}


function socketGet(client, d) {
  const func = d.verb+d.subject.replace(/\w/, w => w.toUpperCase())
  console.log(`socketGet ${func}`)
  if (get[func]) {
    get[func](client, d)
  } else {
    get.error(func)
  }
}

module.exports = socketGet