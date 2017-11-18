import init from './helpers/init'
import F from './helpers/func_choose'
import Nav from './helpers/navigation'

init( F.readPools.bind(null, () => {
  F.listen(true)
  F.newPoolMatch()
}) )
Nav.setupClearData()