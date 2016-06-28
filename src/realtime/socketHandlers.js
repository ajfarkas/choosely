import Setup from '../helpers/func_setup'
import Create from '../helpers/func_create'
import Choose from '../helpers/func_choose'
import cookie from '../static/js.cookie.js'

const handlers = {
  connected: data => {
    console.log('connectedHandler', data)
    if (cookie('user_id')) {
      Object.assign(Data.user, JSON.parse(cookie('user_id')) )
      Data.user.dbID = Data.user.partner > Data.user.user
        ? `${Data.user.partner}_${Data.user.user}`
        : `${Data.user.user}_${Data.user.partner}`
    }
    Setup.readNames()
  },
  namesRead: data => {
    console.log('namesRead')
    if (window.location.pathname.match(/\/create\b/)) {
      const sortedData = Object.keys(data).sort((a, b) => data[a].createDate > data[b].createDate)
      sortedData.forEach(record => {
        Create.addNameToDOM(data[record])
      })
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.names = data
      Choose.readPools()
    }
  },
  nameAdded: data => {
    if (window.location.pathname.match(/\/create\b/)) {
      if (window.Data.names[data.id] === undefined) {
        Create.addNameToDOM(data) 
      }
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.names[data.id] = data
    }
  },
  poolRead: data => {
    console.log(data)
  }
}

export default function setHandlers(cb) {
  Object.keys(handlers).forEach(event => {
    socket.on(event, handlers[event])
  })

  if (cb) {
    return cb()
  }
}