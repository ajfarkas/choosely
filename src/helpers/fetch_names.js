const Names = {}

Names.read = (kind) => {
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
    .then(data => console.log(`names: ${JSON.stringify(data)}`))
    .catch(err => console.error(err))
}

export default Names