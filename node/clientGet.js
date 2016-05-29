// All DB READ functions

const db = require('./data')

const get = {
  /* Read Names
   * Return all names associated with user account.
   * Args: Data (`Obj`)
   *   - verb: 'read'
   *   - subject: 'names'
   *   - user: user concat partner name
  */
  readNames: (client, data) => {
    var names = {}
    
    db.createValueStream({gte: `${data.user}_`, lte: `${data.user}_\xff`, valueEncoding: 'json'})
      .on('error', err => console.error(err))
      .on('data', d => {
        if (Object.keys(names).indexOf(d.id) === -1) {
          d.score = d.score === undefined ? 0 : d.score
          d.matches = d.matches === undefined ? {} : d.matches
          names[d.id] = d
          console.log(names)
        }
      })
      .on('end', () => {
        client.emit('namesRead', names)
      })
  },
  error: func => {
    console.error(`${func} is not a socket.get function.`)
  }
}

function socketGet(client, d) {
  console.log('socketGet')
  const func = d.verb+d.subject.replace(/\w/, w => w.toUpperCase())
  if (get[func]) {
    get[func](client, d)
  } else {
    get.error(func)
  }
}

module.exports = socketGet