const db = require('./data')

const put = {
  /* Create Name
   * Args: Data (`Obj`)
   *   - verb: 'create'
   *   - subject: 'name'
   *   - user: user concat partner name
   *   - name: new name
  */
  createName: (client, data) => {
    const lookup = `${data.user}_${data.name}`
    const info = { name: data.name }
    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.name} saved to DB.`)
      // client.emit('nameAdded', data)
    })
  },
  error: func => {
    console.error(`${func} is not a socket.put function.`)
  }
}

function socketPut(client, d) {
  const func = d.verb+d.subject.replace(/\w/, w => w.toUpperCase())
  if (put[func]) {
    put[func](client, d)
  } else {
    put.error(func)
  }
}

module.exports = socketPut