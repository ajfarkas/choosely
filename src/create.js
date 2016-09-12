import connect from './realtime/connect'
import F from './helpers/func_create'
import Help from './helpers/helpers'
import setHandlers from './realtime/socketHandlers'

connect(setHandlers)

if (location.pathname === '/create/last') {
  Help.$('.list-kind').innerText = 'Last Names'
  Help.$('#add-family').innerText = 'Add First Name'
} else {
  Help.$('.list-kind').innerText = 'First Names'
  Help.$('#add-family').innerText = 'Add Last Name'
}

Help.$('#add-family').addEventListener('click', F.toggleFirstLast)
// use input value to create new name
Help.$('#names .input-btn').addEventListener('click', F.createName)
Help.$('[name=\"name\"]').addEventListener('keypress', F.enterAndCreateName)
Help.$('#finish-list').addEventListener('click', () => location.pathname = '/choose')