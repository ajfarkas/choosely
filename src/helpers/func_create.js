// import cookie from '../static/js.cookie.js'
import Help from './helpers'

const F = {}

F.deleteName = e => {
  const parent = e.target.parentNode,
        id = parent.dataset.value,
        subject = location.pathname.match('create/last')
          ? 'lastname'
          : 'name'

  socket.emit('put', {
    verb: 'delete',
    subject: subject,
    team: Data.user.dbID,
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
  // delete name if blank
  if (!name.length) {
    F.cancelUpdateNameMode()
    return F.deleteName({ target: { parentNode: target } })
  }

  // update local Data Object
  Data.names[id].name = name

  const subject = location.pathname.match('create/last')
    ? 'lastname'
    : 'name'
  // send to server
  socket.emit('put', {
    verb: 'update',
    subject: subject,
    team: Data.user.dbID,
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
  // focus on input
  input.focus()
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
  const subject = location.pathname.match('create/last')
    ? 'lastname'
    : 'name'
  // send to server
  socket.emit('put', {
    verb: 'create',
    subject: subject,
    team: Data.user.dbID,
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

F.toggleFirstLast = e => {
  e.preventDefault()

  if (location.pathname.match(/\blast\b/)) {
    location.pathname = 'create/first'
  } else {
    location.pathname = 'create/last'
  }
}

export default F