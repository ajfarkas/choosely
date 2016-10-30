const Names = {}

/* Read Names
 * Read team names from db
 * Arg:
 *   - kind ('str'): 'first' || 'last'
 * Res: JSON obj containing name data
*/
Names.read = (kind, cb) => {
  const req = new Request(
    `${location.origin}/names/read/${kind}/`,
    { 
      method: 'get',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.token
      }) 
    }
  )

  fetch(req)
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => {
      console.log(kind, req)
      console.error(err)
    })
}
/* Create Names
 * Create name and associate with team account.
 * Args:
 *   - name (`str`): name to be created
 *   - kind ('str'): 'first' || 'last'
 * Res: JSON obj containing name data
*/
Names.create = (name, kind, cb) => {
  const req = new Request(
    `${location.origin}/names/create/${kind}/`,
    {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.token
      }),
      body: JSON.stringify({
        name: name
      })
    }
  )

  fetch(req)
    .then(res => res.json())
    .then(data => {
      if (typeof cb === 'function') {
        cb(data)
      }
    })
    .catch(err => console.error(err))
}
/* Update Names
 * Update name associated with team account.
 * Args:
 *   - nameData (`obj`): include any fields to be updated.
 *     Each field is optional.
 *   - kind ('str'): 'first' || 'last'
 * Res: JSON obj containing name data
*/
Names.update = (nameData, kind, cb) => {
  const req = new Request(
    `${location.origin}/names/update/${kind}/`,
    {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.token
      }),
      body: JSON.stringify(nameData)
    }
  )

  fetch(req)
    .then(res => res.json())
    .then(data => {
      if (typeof cb === 'function') {
        cb(data)
      }
    })
    .catch(err => console.error(err))
}
/* Delete Names
 * Delete name associated with team account.
 * Args:
 *   - nameID (`uuid`): ID of name to be deleted.
 *   - kind ('str'): 'first' || 'last'
 * Res: UUID of deleted name
*/
Names.delete = (nameID, kind, cb) => {
  const req = new Request(
    `${location.origin}/names/delete/${kind}/`,
    {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.token
      }),
      body: JSON.stringify({
        id: nameID
      })
    }
  )

  fetch(req)
    .then(data => {
      if (typeof cb === 'function') {
        cb(data)
      }
    })
    .catch(err => console.error(err))
}

export default Names