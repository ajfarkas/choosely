const cookie = require('./static/js.cookie.js')

const F = {}
F.$ = (selector, container) => {
  container = container || document
  return container.querySelector(selector)
},

F.login = e => {
  e.preventDefault()
  
  let userId = undefined
  const user = F.$('[name=\"user\"]').value.toLowerCase()
  const partner = F.$('[name=\"partner\"]').value.toLowerCase()

  if (user > partner) {
    userId = `${user}_${partner}`
  } else {
    userId = `${partner}_${user}`
  }

  cookie('userId', userId)
  window.location.pathname = '/create.html'
},

F.deleteName = e => {
  e.preventDefault()

  const parent = e.target.parentNode
  const name = parent.dataset.value

  socket.emit('put', {
    verb: 'delete',
    subject: 'name',
    user: cookie('userId'),
    name: name
  })

  parent.remove()
  delete Data.names[name]
}

F.addNameToDOM = record => {
  const li = document.createElement('li')
  const btn = document.createElement('button')
  const input = F.$('[name=\"name\"]')
  if (!record) {
    record.name = input.value
    record.score = 0
    record.matches = {}
  }
  // add to Global
  window.Data.names[record.name] = record
  // set up li
  li.className = 'name'
  li.innerText = record.name
  li.dataset.value = record.name
  li.addEventListener('click', () => {
    Data.names[record.name].score++
    socket.emit('put', {
      verb: 'update',
      subject: 'name',
      user: cookie('userId'),
      nameObj: Data.names[record.name]
    })
  })
  // set up button
  btn.className= 'close'
  btn.setAttribute('type', 'button')
  btn.innerText = 'X'
  btn.addEventListener('click', F.deleteName)

  // add to client
  li.appendChild(btn)
  F.$('.names').appendChild(li)
  // clear input
  input.value = ''
  return record.name
},

F.createName = e => {
  e.preventDefault()

  const value = F.addNameToDOM()
  // send to server
  socket.emit('put', {
    verb: 'create',
    subject: 'name',
    user: cookie('userId'),
    name: value
  })
},

F.readNames = () => {
  socket.emit('get', {
    verb: 'read',
    subject: 'names',
    user: cookie('userId')
  })
}

module.exports = F