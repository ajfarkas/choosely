const F = require('./functions')

const handlers = {
  namesRead: data => {
    Object.keys(data).forEach(F.addNameToDOM)
  },
  nameAdded: data => {
    if (window.Data.names[data.name] === undefined) {
      F.addNameToDOM(data.name)
    }
  }
}

module.exports = () => {
  Object.keys(handlers).forEach(event => {
    socket.on(event, handlers[event])
  })
}