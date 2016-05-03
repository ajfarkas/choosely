const F = require('./functions')

const handlers = {
  namesRead: data => {
    Object.keys(data).forEach(record => {
      F.addNameToDOM(data[record])
    })
  },
  nameAdded: data => {
    if (window.Data.names[data.name] === undefined) {
      F.addNameToDOM(data) 
    }
  }
}

module.exports = () => {
  Object.keys(handlers).forEach(event => {
    socket.on(event, handlers[event])
  })
}