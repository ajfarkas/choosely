import Setup from '../helpers/func_setup'
import Create from '../helpers/func_create'
import Choose from '../helpers/func_choose'
import cookie from '../static/js.cookie.js'

const handlers = {
  connected: data => {
    console.log('connectedHandler', data)
    Data.user = JSON.parse(localStorage.userData)
    if (!location.pathname.match('create/last')) {
      Setup.readNames()
    }
    if (!location.pathname.match('create/first')) {
      Setup.readLastnames()
    }
  },
  namesRead: data => {
    console.log('namesRead', data)
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
  lastnamesRead: data => {
    console.log('lastnamesRead', data)
    if (window.location.pathname.match(/\/create\b/)) {
      const sortedData = Object.keys(data).sort((a, b) => data[a].createDate > data[b].createDate)
      sortedData.forEach(record => {
        Create.addNameToDOM(data[record])
      })
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.lastnames = data
      // Choose.readPools()
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
  lastnameAdded: data => {
    if (window.location.pathname.match(/\/create\b/)) {
      if (window.Data.names[data.id] === undefined) {
        Create.addNameToDOM(data) 
      }
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.lastnames[data.id] = data
    }
  },
  poolRead: data => {
    console.log('pool read')
    Data.pools = data
    Data.currentMatch = 0

    Choose.newPoolMatch()
  },
  bracketRead: data => {
    console.log('bracket read')
    Data.bracket = data
    Data.currentMatch = 0

    Choose.newBracketMatch()
  }
}

export default function setHandlers(cb) {
  Object.keys(handlers).forEach(event => {
    socket.on(event, handlers[event])
  })

  if (typeof cb === 'function') {
    return cb()
  }
}