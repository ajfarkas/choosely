// All DB WRITE functions

const db = require('./data')
const uuid = require('node-uuid')

const put = {
  /* Create Name
   * Add name to user account.
   * Args: data (`Obj`)
   *   - verb: 'create'
   *   - subject: 'name'
   *   - user: user joined with partner uuid by `_`
   *   - name: new name
  */
  createName: (client, data) => {
    console.log(`createname: ${data.name}`)
    const info = {
      id: uuid.v4(),
      name: data.name,
      createDate: Date.now()
    }
    data.user.split('_').forEach(id => {
      info[id] = {
        score: 0,
        matches: {},
        eliminated: false
      }
    })
    const lookup = `${data.user}_name_${info.id}`
    db.put(lookup, info, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${info.name} saved to DB.`)
      client.emit('nameAdded', info)
    })
  },
  /* Update Name
   * Add name to user account.
   * Args: data (`Obj`)
   *   - verb (`str`): 'update'
   *   - subject (`str`): 'name'
   *   - user (`str`):  user joined with partner uuid by `_`
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
    console.log(`\nupdatename: \n${JSON.stringify(data)}\n\n`)
    const info = data.nameObj
    const lookup = `${data.user}_name_${info.id}`

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
   *   - user: user joined with partner uuid by `_`
   *   - id (`uuid`): identifier for name to remove from db
  */
  deleteName: (client, data) => {
    const lookup = `${data.user}_name_${data.id}`
    db.del(lookup, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.id} deleted from DB.`)
      client.emit('nameDeleted', data.id)
    })
  },
  /* Update Pool
   * update user-partner pool.
   * Args: data (`Obj`)
   *   - verb (`str`): 'update'
   *   - subject (`str`): 'pool'
   *   - user (`str`): user joined with partner uuid by `_`
   *   - pool ('arr'): array of arrays or uuid pairs
  */
  updatePool: (client, data) => {
    console.log(`updatepool: ${data.user}`)
    db.put(`${data.user}_pools`, data.pool, { valueEncoding: 'json' }, err => {
      if (err) {
        return console.error(err)
      }
      console.log(`${data.user}_pools updated in DB:\n${data.pool}`)
      client.emit('poolUpdated', data.pool)
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