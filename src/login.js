import connect from './realtime/connect'
import F from './helpers/functions'
import Help from './helpers/helpers'

connect()
Help.$('#login-btn').addEventListener('click', F.login)