import init from './helpers/init'
import F from './helpers/func_create'
import Help from './helpers/helpers'

init( () => {
  const whichName = location.pathname.match(/create\/(\w*)\/?/)[1]
  // sort names from storage
  const nameStore = Data[`${whichName}names`]
  const sortedData = Object.keys(nameStore).sort((a, b) => nameStore[a].createDate > nameStore[b].createDate)
  sortedData.forEach(record => {
    F.addNameToDOM(nameStore[record])
  })

  // Setup firstname/lastname
  if (whichName === 'last') {
    Help.$('.list-kind').innerText = 'Last Names'
    Help.$('#add-family').innerText = 'Add First Name'
  } else if (whichName === 'first') {
    Help.$('.list-kind').innerText = 'First Names'
    Help.$('#add-family').innerText = 'Add Last Name'
  }

  // add listeners
  Help.$('#add-family').addEventListener('click', F.toggleFirstLast)
  // use input value to create new name
  Help.$('#names .input-btn').addEventListener('click', F.createName)
  Help.$('[name=\"name\"]').addEventListener('keypress', F.createName)
  Help.$('#finish-list').addEventListener('click', () => location.pathname = '/choose')

  Help.$('[name=\"name\"]').focus()
})