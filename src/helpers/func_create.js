import Help from './helpers'
import names from './fetch_names'

const F = {}

F.deleteName = e => {
  const parent = e.target.parentNode,
        id = parent.dataset.value
        
  names.delete(
    id,
    location.pathname.match(/create\/(\w*)\/?/)[1]
  )

  parent.remove()
  delete Data.firstnames[id]
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
  input.removeEventListener('keypress', F.updateName)

  button.addEventListener('click', F.createName)
  input.addEventListener('keypress', F.createName)
}

F.updateName = e => {
  if (e.type === 'keypress' && e.keyCode !== 13) {
    return false
  }
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
  Data.firstnames[id].name = name

  names.update(
    Data.firstnames[id],
    location.pathname.match(/create\/(\w*)\/?/)[1]
  )
  
  // reset selected name
  target.dataset.name = name
  Help.$('.name-label', target).innerText = name
  
  F.cancelUpdateNameMode()
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
  input.removeEventListener('keypress', F.createName)

  button.addEventListener('click', F.updateName)
  input.addEventListener('keypress', F.updateName)
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
  window.Data.firstnames[record.id] = record
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
  if (e.type === 'keypress' && e.keyCode !== 13) {
    return false
  }
  e.preventDefault()
  names.create(
    Help.$('#names input').value,
    location.pathname.match(/create\/(\w*)\/?/)[1],
    F.addNameToDOM
  )
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