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

  db.createValueStream({gte: `${data.user}_`, lte: `${data.user}_\xff`, valueEncoding: 'json'})
    .on('error', err => console.error(err))
    .on('data', d => {
      if (Object.keys(names).indexOf(d.id) === -1) {
        names[d.id] = d
      }
    })
    .on('end', () => {
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
  db.get(`${data.user}_pools`, { valueEncoding: 'json' }, (err, pools) => {
    if (err && err.notFound || forceRefresh) {
      // create Pool
      console.log('creating new pool.')
      get.readNames(client, data, (names) => {
        const idArray = Object.keys(names)
        const poolNum = Math.ceil(idArray.length / poolSize)
        var i = poolNum
        pools = []

        console.log(idArray, poolNum)
        for (; i > 0; i--) {
          pools[i - 1] = []
        }
        console.log(pools)
        idArray.forEach((name, j) => {
          pools[j % poolNum].push(name)
        })
        console.log('pool created', pools)
        client.emit('poolRead', pools)
        db.put(`${data.user}_pools`, pools, { valueEncoding: 'json' }, err2 => {
          if (err2) {
            return console.error(err2)
          }
        })
      })
    } else if (err) {
      return console.error(err)
    } else {
      console.log('read stored pool')
      client.emit('poolRead', pools)
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