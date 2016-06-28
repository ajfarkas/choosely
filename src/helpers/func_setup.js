const F = {}

F.readNames = () => {
  if (Data.user.dbID) {
    socket.emit('get', {
      verb: 'read',
      subject: 'names',
      user: Data.user.dbID
    })
  } else {
    alert('Data.user.dbID not found!')
  }
}

export default F