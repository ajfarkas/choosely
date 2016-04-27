const cookie = require('./static/js.cookie.js')

const F = {}
F.$ = (selector, container) => {
  container = container || document
  return container.querySelector(selector)
},

F.login = (e) => {
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

F.addNameToDOM = (value) => {
  const li = document.createElement('li')
  const input = F.$('[name=\"name\"]')
  if (value === undefined) {
    value = input.value
  }
  // add to Global
  window.Data.names[value] = {
    name: value,
    score: 0,
    matches: {}
  }
  // add to client
  li.className = 'name'
  li.innerText = value
  F.$('.names').appendChild(li)
  // clear input
  input.value = ''
  return value
},

F.createName = (e) => {
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