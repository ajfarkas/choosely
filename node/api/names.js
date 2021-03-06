const Op = {},
      db = require('../data'),
      Help = require('./helpers'),
      jwtDecode = require('jwt-decode'),
      uuid = require('uuid/v4')

/* Read Names
 * Return all names associated with user account.
 * method: 'get'
 * req.headers: 
 *   - Authorization: JSON Web Token
 * req.params:
 *   - kind (`enum`): 'first' || 'last'
 * response:
 *   - `Obj` containing nameID:nameData
*/
Op.get = (req, res) => {
  const names = {},
        kind = req.params.kind,
        jwt = jwtDecode( Help.getCookies(req).cjwt )
  const team = Help.getTeamID(jwt)

  db.createValueStream({gte: `${team}_${kind}name_`, lte: `${team}_${kind}name_\xff`, valueEncoding: 'json'})
    .on('error', err => {
      console.error(`readNames: ${err}`)
      res.status(500).json({ error: err })
    })
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
 * req.headers: 
 *   - Authorization: JSON Web Token
 * req.params:
 *   - kind (`enum`): 'first' || 'last'
 * req.body:
 *   - name (`str`): name to create
 * response:
 *   - `Obj` containing name data
*/
Op.post = (req, res) => {
  const jwt = jwtDecode( Help.getCookies(req).cjwt ),
        kind = req.params.kind,
        info = {
          id: uuid(),
          name: req.body.name,
          createDate: Date.now()
        },
        team = Help.getTeamID(jwt)

  team.split('_').forEach(id => {
    info[id] = {
      score: 0,
      matches: {},
      lastnames: {},
      eliminated: false
    }
  })

  db.put(`${team}_${kind}name_${info.id}`, info, { valueEncoding: 'json' }, err => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: err })
    }
    console.log(`${info.name} saved to DB.`)
    res.status(201).json(info)
  })
}

/* Update Names
 * Update existing name associated with team account.
 * method: 'post'
 * req.headers: 
 *   - Authorization: JSON Web Token
 * req.params:
 *   - kind (`enum`): 'first' || 'last'
 * req.body: (`obj`) nameData
 *   - id (`uuid`): required. ID of name to update
 *   - all other nameData fields are optional.
 * response:
 *   - `Obj` containing name data
*/
Op.put = (req, res) => {
  const jwt = jwtDecode( Help.getCookies(req).cjwt ),
        team = Help.getTeamID(jwt),
        kind = req.params.kind,
        nameData = Array.isArray(req.body) ? req.body : [req.body],
        nameDataLen = nameData.length,
        halt = false
  let dataProcessed = 0

  if (!nameData[0] || !nameData[0].id) {
    return res.status(422).json({ error: 'request is missing body or name ID' })
  }

  nameData.forEach(info => {
    const lookup = `${team}_${kind}name_${info.id}`
    db.get(lookup, { valueEncoding: 'json' }, (err, entry) => {
      if (err) {
        halt = true
        console.error('update getErr:', err)
        if (!halt) {
          return res.status(500).json({ error: err })
        }
      }

      for (key in info) {
        entry[key] = info[key]
      }

      db.put(lookup, entry, { valueEncoding: 'json' }, putErr => {
        if (putErr) {
          return console.error('update putErr:', putErr)
        }
        console.log(`${info.name} updated.`)
        dataProcessed++
        if (nameDataLen === 1 && !halt) {
          res.status(200).json(entry)
        } else if (dataProcessed === nameDataLen) {
          res.status(204)
        }
      })
    })
  })
}

/* Delete Names
 * Delete existing name associated with team account.
 * method: 'post'
 * req.headers: 
 *   - Authorization: JSON Web Token
 * req.body:
 *   - id (`uuid`): required. ID of name to delete
 * response:
 *   - `Obj` { id: 'id of deleted name' }
*/
Op.delete = (req, res) => {
  const jwt = jwtDecode( Help.getCookies(req).cjwt )
  const team = Help.getTeamID(jwt)
  const kind = req.params.kind
  const id = req.body.id

  if (!id) {
    return res.status(422).json({ error: 'request is missing name ID.'})
  }

  db.del(`${team}_${kind}name_${id}`, err => {
    if (err) {
      return console.error(err)
    }
    console.log(`${id} deleted from DB.`)
    res.status(200).json({ id: id })
  })
}

module.exports = (req, res, cb) => {
  Op[req.method.toLowerCase()](req, res, cb)
}
