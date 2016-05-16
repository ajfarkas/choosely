import F from '../helpers/functions'

const handlers = {
  connected: data => {
    F.readNames(data)
  },
  namesRead: data => {
    if (window.location.pathname.match(/^create$/)) {
      Object.keys(data).forEach(record => {
        F.addNameToDOM(data[record])
      })
    } else if (window.location.pathname.match(/^choose$/)) {
      Data.names = data
    }
  },
  nameAdded: data => {
    if (window.location.pathname.match(/^create$/)) {
      if (window.Data.names[data.name] === undefined) {
        F.addNameToDOM(data) 
      }
    } else if (window.location.pathname.match(/^choose$/)) {
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