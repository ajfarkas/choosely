import F from '../helpers/functions'

const handlers = {
  connected: data => {
    console.log('connectedHandler')
    F.readNames(data)
  },
  namesRead: data => {
    console.log('namesRead')
    if (window.location.pathname.match(/\/create\b/)) {
      const sortedData = Object.keys(data).sort((a, b) => data[a].createDate > data[b].createDate)
      sortedData.forEach(record => {
        F.addNameToDOM(data[record])
      })
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.names = data
    }
  },
  nameAdded: data => {
    if (window.location.pathname.match(/\/create\b/)) {
      if (window.Data.names[data.id] === undefined) {
        F.addNameToDOM(data) 
      }
    } else if (window.location.pathname.match(/\/choose\b/)) {
      Data.names[data.id] = data
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