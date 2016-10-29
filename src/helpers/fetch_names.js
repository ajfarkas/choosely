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
    .catch(err => console.error(err))
}

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
    .then(data => cb(data))
    .catch(err => console.error(err))
}

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

export default Names