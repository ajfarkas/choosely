import cookie from '../static/js.cookie.js'
import Help from './helpers'

const F = {}

F.deleteName = e => {
  e.preventDefault()

  const parent = e.target.parentNode
  const id = parent.dataset.value

  socket.emit('put', {
    verb: 'delete',
    subject: 'name',
    user: cookie('userId'),
    id: id
  })

  parent.remove()
  delete Data.names[id]
}

F.cancelUpdateNameMode = () => {
  const input = Help.$('#names input')
  const button = Help.$('#names button')
  const target = Help.$('.editing')

  // reset input
  input.value = ''
  button.innerText = '+'

  target.className = target.className.replace(' editing', '')
  // switch listeners to Create
  button.removeEventListener('click', F.updateName)
  input.removeEventListener('keypress', F.enterAndUpdateName)

  button.addEventListener('click', F.createName)
  input.addEventListener('keypress', F.enterAndCreateName)
}

F.updateName = e => {
  e.preventDefault()

  const input = Help.$('#names input')
  const target = Help.$('.editing')
  const id = target.dataset.value
  const name = input.value
  // update local Data Object
  Data.names[id].name = name
  // send to server
  socket.emit('put', {
    verb: 'update',
    subject: 'name',
    user: cookie('userId'),
    nameObj: Data.names[id]
  })
  
  // reset selected name
  target.dataset.name = name
  Help.$('.name-label', target).innerText = name
  
  F.cancelUpdateNameMode()
}

F.enterAndUpdateName = e => {
  if (e.keyCode === 13) {
    e.preventDefault()
    F.updateName(e)
  } else {
    return true
  }
}

F.updateNameMode = e => {
  e.preventDefault()

  const parent = e.target.parentNode
  const name = parent.dataset.name
  const input = Help.$('#names input')
  const button = Help.$('#names button')
  const prev = Help.$('.editing')
  // clear any previous editing class or cancel edit
  if (prev) {
    if (prev === parent) {
      return F.cancelUpdateNameMode()
    } else {
      prev.className = prev.className.replace(' editing', '')
    }
  }

  parent.className += ' editing'
  input.value = name
  button.innerText = '√'
  // switch listeners to Update
  button.removeEventListener('click', F.createName)
  input.removeEventListener('keypress', F.enterAndCreateName)

  button.addEventListener('click', F.updateName)
  input.addEventListener('keypress', F.enterAndUpdateName)
}

F.addNameToDOM = record => {
  const main = Help.$('main')
  const li = document.createElement('li')
  const num = document.createElement('p')
  const name = document.createElement('p')
  const btn = document.createElement('button')
  const input = Help.$('[name=\"name\"]')
  if (!record) {
    return console.error('no record provided!')
  }
  // add to Global
  window.Data.names[record.id] = record
  // set up li
  li.className = 'name'
  li.dataset.value = record.id
  li.dataset.name = record.name
  // li.addEventListener('click', () => {
  //   Data.names[record.id].score++
  //   socket.emit('put', {
  //     verb: 'update',
  //     subject: 'name',
  //     user: cookie('userId'),
  //     nameObj: Data.names[record.id]
  //   })
  // })

  num.className = 'name-order'
  num.innerText = Help.$$('.name').length + 1

  name.className = 'name-label'
  name.innerText = record.name
  // set up button
  btn.className= 'edit-btn'
  btn.setAttribute('type', 'button')
  btn.innerText = 'edit'
  btn.addEventListener('click', F.updateNameMode)

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
}

F.createName = e => {
  e.preventDefault()

  // send to server
  socket.emit('put', {
    verb: 'create',
    subject: 'name',
    user: cookie('userId'),
    name: Help.$('#names input').value
  })
}

F.enterAndCreateName = e => {
  if (e.keyCode === 13) {
    e.preventDefault()
    F.createName(e)
  } else {
    return true
  }
}

F.readNames = () => {
  socket.emit('get', {
    verb: 'read',
    subject: 'names',
    user: cookie('userId')
  })
}

module.exports = F