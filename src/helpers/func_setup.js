const F = {}

F.readNames = () => {
  console.log('F.readNames')
  if (Data.user.dbID) {
    socket.emit('get', {
      verb: 'read',
      subject: 'names',
      team: Data.user.dbID
    })
  } else {
    alert('Data.user.dbID not found!')
  }
}

F.readLastnames = () => {
  console.log('F.readLastnames')
  if (Data.user.dbID) {
    socket.emit('get', {
      verb: 'read',
      subject: 'lastnames',
      team: Data.user.dbID
    })
  } else {
    alert('Data.user.dbID not found!')
  }
}

export default F