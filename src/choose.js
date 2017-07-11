import init from './helpers/init'
import F from './helpers/func_choose'

init( F.readPools.bind(null, data => {
  F.listen()
  if (data.matches[0].length === 1) {
    alert(`We have a winner!\nCongrats to ${Data.firstnames[data.matches[0]].name}!`)
  } else {
    F.newBracketMatch()
  }
}) )