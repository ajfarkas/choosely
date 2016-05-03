// All DB WRITE functions

const db = require('./data')

const put = {
  /* Create Name
   * Add name to user account.
   * Args: data (`Obj`)
   *   - verb: 'create'
   *   - subject: 'name'
   *   - user: user concat partner name
   *   - name: new name
  */
  createName: (client, data) => {
    const lookup = `${data.user}_${data.name}`
    const info = {
      name: data.name,
      score: 0,
      matches: {}
    }
    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.name} saved to DB.`)
      // client.emit('nameAdded', data)
    })
  },
  /* Update Name
   * Add name to user account.
   * Args: data (`Obj`)
   *   - verb (`str`): 'create'
   *   - subject (`str`): 'name'
   *   - user (`str`):  user concat partner name
   *   - nameObj ('Obj'):
   *     - name (`str`): name in contest
   *     - score (`int`): value of this name's score
   *     - matches (`obj`): obj describing number of times (v)
   *       matched against other names (k).
  */
  updateName: (client, data) => {
    const info = data.nameObj
    const lookup = `${data.user}_${info.name}`
    console.log(lookup)
    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.nameObj.name} updated in DB:\n${JSON.stringify(data.nameObj)}`)
    })
  },
  /* Delete Name
   * Delete name from user account.
   * Args: data (`Obj`)
   *   - verb: 'delete'
   *   - subject: 'name'
   *   - user: user concat partner name
   *   - name: name to remove from DB
  */
  deleteName: (client, data) => {
    const lookup = `${data.user}_${data.name}`
    db.del(lookup, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.name} deleted from DB.`)
    })
  },
  error: func => {
    console.error(`${func} is not a socket.put function.`)
  }
}

// entry point for all `write` functions.
function socketPut(client, d) {
  const func = d.verb+d.subject.replace(/\w/, w => w.toUpperCase())
  if (put[func]) {
    put[func](client, d)
  } else {
    put.error(func)
  }
}

module.exports = socketPut