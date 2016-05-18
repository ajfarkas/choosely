import F from '../helpers/functions'

const handlers = {
  connected: data => {
    console.log('connectedHandler')
    F.readNames(data)
  },
  namesRead: data => {
    console.log('namesRead')
    if (window.location.pathname.match(/\/create\b/)) {
      Object.keys(data).forEach(record => {
        F.addNameToDOM(data[record])
      })
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.names = data
    }
  },
  nameAdded: data => {
    if (window.location.pathname.match(/\/create\b/)) {
      if (window.Data.names[data.name] === undefined) {
        F.addNameToDOM(data) 
      }
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.names[data.name] = data
    }
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