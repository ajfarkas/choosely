import init from './helpers/init'
import F from './helpers/func_create'
import Help from './helpers/helpers'
import setHandlers from './realtime/socketHandlers'
import names from './helpers/fetch_names'

init(setHandlers)

const whichName = location.pathname.match(/create\/(\w*)\/?/)[1]
// read names from API
names.read(whichName)

if (whichName === 'last') {
  Help.$('.list-kind').innerText = 'Last Names'
  Help.$('#add-family').innerText = 'Add First Name'
} else if (whichName === 'first') {
  Help.$('.list-kind').innerText = 'First Names'
  Help.$('#add-family').innerText = 'Add Last Name'
}

Help.$('#add-family').addEventListener('click', F.toggleFirstLast)
// use input value to create new name
Help.$('#names .input-btn').addEventListener('click', F.createName)
Help.$('[name=\"name\"]').addEventListener('keypress', F.enterAndCreateName)
Help.$('#finish-list').addEventListener('click', () => location.pathname = '/choose')