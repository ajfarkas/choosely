const Op = {},
      db = require('../data'),
      Help = require('./helpers'),
      jwtDecode = require('jwt-decode')

/* Read Names
 * Return all names associated with user account.
 * method: 'get'
 * req.body:
 *   - Authorization: JSON Web Token
 * res:
 *   - `Obj` containing nameID:nameData
*/
Op.read = (req, res, cb) => {
  console.log('read')
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
      // if (typeof cb === 'function') {
      //   cb(names)
      // } else {
      console.log('end')
      res.status(200).json(names)
      // }
    })
}

module.exports = (req, res, cb) => {
  Op[req.params.op](req, res, cb)
}
