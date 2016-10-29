const Op = {},
      db = require('../data'),
      Help = require('./helpers'),
      jwtDecode = require('jwt-decode'),
      uuid = require('node-uuid')

/* Read Names
 * Return all names associated with user account.
 * method: 'get'
 * req.body:
 *   - Authorization: JSON Web Token
 * response:
 *   - `Obj` containing nameID:nameData
*/
Op.read = (req, res) => {
  const names = {},
        kind = req.params.kind,
        jwt = jwtDecode( req.headers.authorization.replace(/^JWT\s/, '') )
  const team = Help.getTeamID(jwt)

  db.createValueStream({gte: `${team}_${kind}name_`, lte: `${team}_${kind}name_\xff`, valueEncoding: 'json'})
    .on('error', err => console.error(`readNames: ${err}`))
    .on('data', d => {
      if (Object.keys(names).indexOf(d.id) === -1) {
        names[d.id] = d
      }
    })
    .on('end', () => {
      res.status(200).json(names)
    })
}

/* Create Names
 * Create name and associate with team account.
 * method: 'post'
 * req.body:
 *   - Authorization: JSON Web Token
 *   - name (`str`): name to create
 *   - kind (`str`): 'first' || 'last'
 * response:
 *   - `Obj` containing name data
*/
Op.create = (req, res) => {
  const jwt = jwtDecode( req.headers.authorization.replace(/^JWT\s/, '') )
  const kind = req.params.kind
  const info = {
    id: uuid.v4(),
    name: req.body.name,
    createDate: Date.now()
  }
  const team = Help.getTeamID(jwt)

  team.split('_').forEach(id => {
    info[id] = {
      score: 0,
      matches: {},
      lastnames: {},
      eliminated: false
    }
  })

  const lookup = `${team}_${kind}name_${info.id}`
  db.put(lookup, info, { valueEncoding: 'json' }, err => {
    if (err) {
      return console.error(err)
    }
    console.log(`${info.name} saved to DB.`)
    res.status(201).json(info)
  })
}

Op.update = (req, res) => {
  const jwt = jwtDecode( req.headers.authorization.replace(/^JWT\s/, '') )
  const team = Help.getTeamID(jwt)
  const kind = req.params.kind
  const info = req.body

  if (!info || !info.id) {
    res.status(422).json({ error: 'request is missing body or name ID' })
  }

  const lookup = `${team}_${kind}name_${info.id}`
  db.get(lookup, { valueEncoding: 'json' }, (err, entry) => {
    if (err) {
      return console.error('update getErr:', err)
    }

    for (key in info) {
      entry[key] = info[key]
    }

    db.put(lookup, entry, { valueEncoding: 'json' }, putErr => {
      if (putErr) {
        return console.error('update putErr:', putErr)
      }
      console.log(`${info.name} updated.`)
      res.status(200).json(entry)
    })
  })
}

module.exports = (req, res, cb) => {
  Op[req.params.op](req, res, cb)
}
