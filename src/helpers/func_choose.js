const F = {}


F.readPools = () => {
  socket.emit('get', {
    verb: 'read',
    subject: 'pool',
    user: Data.user.dbID
  })
}


F.setNewPoolMatch = () => {
}

F.initBracket = () => {
}

F.setNewBracketMatch = () => {
}

export default F