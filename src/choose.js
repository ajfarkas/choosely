import init from './helpers/init'
import F from './helpers/func_choose'

init( F.readPools.bind(null, () => {
  F.listen(true)
  F.newPoolMatch()
}) )