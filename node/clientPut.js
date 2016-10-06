// All DB WRITE functions

const db = require('./data')
const uuid = require('node-uuid')

const put = {
  /* Create Name
   * Add name to user account.
   * Args: data (`Obj`)
   *   - verb: 'create'
   *   - subject: 'name'
   *   - team: user joined with partner uuid by `_`
   *   - name: new name
  */
  createName: (client, data) => {
    console.log(`createname: ${data.name}`)
    const info = {
      id: uuid.v4(),
      name: data.name,
      createDate: Date.now()
    }
    data.team.split('_').forEach(id => {
      info[id] = {
        score: 0,
        matches: {},
        eliminated: false
      }
    })
    const lookup = `${data.team}_name_${info.id}`
    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${info.name} saved to DB.`)
      client.emit('nameAdded', info)
    })
  },
  /* Update Name
   * Update name on user account.
   * Args: data (`Obj`)
   *   - verb (`str`): 'update'
   *   - subject (`str`): 'name'
   *   - team (`str`):  user joined with partner uuid by `_`
   *   - nameObj ('Obj'):
   *     - id (`uuid`): identifier for name obj
   *     - name (`str`): name in contest
   *     - [user/partner UUID] (`obj`):
   *       - score (`int`): number of wins associated with this name
   *       - matches (`arr`): array of ids of other names this name was matched against.
   *       - elimainated (`bool`): whether this name has been eliminated
   *         from this user's bracket.
  */
  updateName: (client, data) => {
    console.log(`updatename: ${data.nameObj.id}`)
    const info = data.nameObj
    const lookup = `${data.team}_name_${info.id}`

    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.nameObj.name} updated in DB.`)
      client.emit('nameUpdated', info)
    })
  },
  /* Delete Name
   * Delete name from user account.
   * Args: data (`Obj`)
   *   - verb: 'delete'
   *   - subject: 'name'
   *   - team: user joined with partner uuid by `_`
   *   - id (`uuid`): identifier for name to remove from db
  */
  deleteName: (client, data) => {
    const lookup = `${data.team}_name_${data.id}`
    db.del(lookup, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.id} deleted from DB.`)
      client.emit('nameDeleted', data.id)
    })
  },
  /* Create Last Name
   * Add last name to user account.
   * Args: data (`Obj`)
   *   - verb: 'create'
   *   - subject: 'lastname'
   *   - team: user joined with partner uuid by `_`
   *   - name: new last name
  */
  createLastname: (client, data) => {
    console.log(`updateLastname: ${data.name}`)
    const info = {
      id: uuid.v4(),
      name: data.name,
      createDate: Date.now()
    }
    const lookup = `${data.team}_lastname_${info.id}`
    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(`createLastname Err: ${err}`)
      }
      console.log(`lastname ${info.name} saved to DB.`)
      client.emit('lastnameAdded', info)
    })
  },
    /* Update Last Name
   * Update last name on user account.
   * Args: data (`Obj`)
   *   - verb (`str`): 'update'
   *   - subject (`str`): 'lastname'
   *   - team (`str`):  user joined with partner uuid by `_`
   *   - nameObj ('Obj'):
   *     - id (`uuid`): identifier for name obj
   *     - name (`str`): name in contest
  */
  updateLastname: (client, data) => {
    console.log(`updatelastname: ${data.nameObj.id}`)
    const info = data.nameObj
    const lookup = `${data.team}_lastname_${info.id}`

    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.nameObj.name} updated in DB.`)
      client.emit('lastnameUpdated', info)
    })
  },
  /* Delete Name
   * Delete name from user account.
   * Args: data (`Obj`)
   *   - verb: 'delete'
   *   - subject: 'lastname'
   *   - team: user joined with partner uuid by `_`
   *   - id (`uuid`): identifier for name to remove from db
  */
  deleteLastname: (client, data) => {
    const lookup = `${data.team}_lastname_${data.id}`
    db.del(lookup, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.id} deleted from DB.`)
      client.emit('lastnameDeleted', data.id)
    })
  },
  /* Update Pool
   * update user-partner pool.
   * Args: data (`Obj`)
   *   - verb (`str`): 'update'
   *   - subject (`str`): 'pool'
   *   - team (`str`): user joined with partner uuid by `_`
   *   - pool ('arr'): array of arrays or uuid pairs
  */
  updatePool: (client, data) => {
    console.log(`updatepool: ${data.team}`)
    db.put(`${data.team}_pools`, data.pool, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.team}_pools updated in DB:\n${data.pool}`)
      client.emit('poolUpdated', data.pool)
    })
  },
  /* Update Bracket
   * update user-partner bracket.
   * Args: data (`Obj`)
   *   - verb (`str`): 'update'
   *   - subject (`str`): 'bracket'
   *   - team (`str`): user joined with partner uuid by `_`
   *   - bracket ('arr'): array of arrays or uuid pairs
  */
  updateBracket: (client, data) => {
    console.log(`updateBracket: ${data.team}`)
    db.put(`${data.team}_bracket`, data.bracket, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.team}_bracket updated in DB.`)
      client.emit('poolUpdated', data.bracket)
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