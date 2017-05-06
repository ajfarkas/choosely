const Choose = {}

/* Read/Create Choose Pool/Bracket
 * Read match kind from DB or create if none exists
 * Arg:
 *   - kind (`enum`): 'pools' | 'bracket'
 * Res: JSON obj containing match data
*/
Choose.read = (kind, cb) => {
  const req = new Request(
    `${location.origin}/${kind}/read/`,
    {
      method: 'get',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }),
      credentials: 'same-origin'
    }
  )

  fetch(req)
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => {
      console.error(err)
    })
}
/* Update Choose Pool/Bracket
 * Update match kind in DB
 * Arg:
 *   - matchData (`obj`): pool or bracket data
 *   - kind (`enum`): 'pools' | 'bracket'
 * Res: JSON obj containing match data
*/
Choose.update = (matchData, kind, cb) => {
  const req = new Request(
    `${location.origin}/${kind}/update/`,
    {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }),
      credentials: 'same-origin',
      body: JSON.stringify(matchData)
    }
  )

  fetch(req)
    .then(res => res.json())
    .then(data => {
      if (typeof cb === 'function') {
        cb(data)
      }
    })
    .catch(err => {
      console.error(err)
    })
}

export default Choose