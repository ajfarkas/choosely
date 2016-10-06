import Help from './helpers'

const F = {}
const choices = ['a', 'b']
const curtain = Help.$('.curtain')
const colorNum = 5

F.readPools = () => {
  socket.emit('get', {
    verb: 'read',
    subject: 'pool',
    team: Data.user.dbID
  })
}

F.readBracket = () => {
  socket.emit('get', {
    verb: 'read',
    subject: 'bracket',
    team: Data.user.dbID,
    user: Data.user.user
  })
}

F.showChoices = () => {
  // push solid bg to back so that names will be visible
  curtain.setAttribute('style', `${curtain.getAttribute('style')} z-index: -1;`)
  // hack to force transition animation
  setTimeout(() => {
    choices.forEach(choice => {
      Help.$(`.name-${choice}`).setAttribute('style', '')
    })
  }, 20)
}

F.refreshChoices = (index, kind) => {
  Data.currentMatch = index
  const names = Data[kind][index],
        lastnames = Object.keys(Data.lastnames),
        lnLen = lastnames.length

  // randomize background colors (dark set on top, light on bottom)
  Help.$('.name-a').dataset.color = Math.ceil(Math.random() * colorNum) * 2 - 1
  Help.$('.name-b').dataset.color = Math.ceil(Math.random() * colorNum) * 2
  choices.forEach((choice, i) => {
    console.log(names[i])
    const lastIndex = Math.floor(Math.random() * lnLen)
    // set firstnames
    Help.$(`.name-${choice} h2`).innerText = Data.names[names[i]].name
    Help.$(`.name-${choice} h2`).dataset.value = names[i]
    // set lastnames
    Help.$(`.name-${choice} h3`).innerText = Data.lastnames[lastnames[lastIndex]].name
    Help.$(`.name-${choice} h3`).dataset.value = lastnames[lastIndex]
  })
  F.showChoices()
}

F.newPoolMatch = () => {
  console.log('new pool match')
  const poolLen = Data.pools.length
  if (poolLen) {
    const index = Math.floor(Math.random() * poolLen)
    F.refreshChoices(index, 'pools')
  } else {
    console.log('pool play is done!')
    F.readBracket()
  }
}

F.resolvePoolMatch = (id, lastnameID) => {
  const match = Data.pools[Data.currentMatch]
  match.forEach((contestant, i) => {
    const nameData = Data.names[contestant][Data.user.user]
    const competitor = match[-i + 1]
    const wins = nameData.matches[competitor] || 0
    const lastnameWins = nameData.lastnames[lastnameID] || 0

    if (contestant === id) {
      // matches & lastnames are constucted in case keys are undefined.
      nameData.matches[competitor] = wins + 1
      nameData.lastnames[lastnameID] = lastnameWins + 1
      nameData.score++
    } else {
      nameData.matches[competitor] = wins
    }
    // save data to server
    socket.emit('put', {
      verb: 'update',
      subject: 'name',
      team: Data.user.dbID,
      nameObj: Data.names[contestant]
    })

  })
  Data.pools.splice(Data.currentMatch, 1)
  console.log(Data.pools)
  socket.emit('put', {
    verb: 'update',
    subject: 'pool',
    team: Data.user.dbID,
    pool: Data.pools
  })
}

F.newBracketMatch = () => {
  console.log('new bracket match')
  const bracketLen = Data.bracket.length
  if (bracketLen) {
    const index = Math.floor(Math.random() * bracketLen)
    F.refreshChoices(index, 'bracket')
  } else {
    console.log('bracket play is done!')
  }
}

F.resolveBracketMatch = (id, lastnameID) => {
  const match = Data.bracket[Data.currentMatch]
  match.forEach((contestant, i) => {
    const nameData = Data.names[contestant][Data.user.user]
    const competitor = match[-i + 1]
    const wins = nameData.matches[competitor] || 0
    const lastnameWins = nameData.lastnames[lastnameID] || 0

    if (contestant === id) {
      // matches & lastnames are constucted in case keys are undefined.
      nameData.matches[competitor] = wins + 1
      nameData.lastnames[lastnameID] = lastnameWins + 1
      nameData.score++
    } else {
      nameData.matches[competitor] = wins
      nameData.eliminated = true
    }
    // save data to server
    socket.emit('put', {
      verb: 'update',
      subject: 'name',
      team: Data.user.dbID,
      nameObj: Data.names[contestant]
    })
  })
  Data.bracket.splice(Data.currentMatch, 1)
  socket.emit('put', {
    verb: 'update',
    subject: 'bracket',
    team: Data.user.dbID,
    bracket: Data.bracket
  })
}

export default F