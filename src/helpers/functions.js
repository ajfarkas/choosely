import cookie from '../static/js.cookie.js'
import Help from './helpers'

const F = {}

F.deleteName = e => {
  e.preventDefault()

  return console.log('F.deleteName temp. disabled')

  // const parent = e.target.parentNode
  // const name = parent.dataset.value

  // socket.emit('put', {
  //   verb: 'delete',
  //   subject: 'name',
  //   user: cookie('userId'),
  //   name: name
  // })

  // parent.remove()
  // delete Data.names[name]
}

F.addNameToDOM = record => {
  const main = Help.$('main')
  const li = document.createElement('li')
  const num = document.createElement('p')
  const name = document.createElement('p')
  const btn = document.createElement('button')
  const input = Help.$('[name=\"name\"]')
  if (!record) {
    record = {
      name: input.value,
      score: 0,
      matches: {}
    }
  }
  // add to Global
  window.Data.names[record.name] = record
  // set up li
  li.className = 'name'
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

  num.className = 'name-order'
  num.innerText = Help.$$('.name').length + 1

  name.className = 'name-label'
  name.innerText = record.name
  // set up button
  btn.className= 'edit-btn'
  btn.setAttribute('type', 'button')
  btn.innerText = 'edit'
  btn.addEventListener('click', F.deleteName)

  // add to client
  li.appendChild(num)
  li.appendChild(name)
  li.appendChild(btn)
  Help.$('.names').appendChild(li)
  // clear input
  input.value = ''
  // keep last name on list onscreen
  main.scrollTop = main.getBoundingClientRect().height

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