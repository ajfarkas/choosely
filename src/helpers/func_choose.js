import Help from './helpers'

const F = {}
const choices = ['a', 'b']
const curtain = Help.$('.curtain')
const colorNum = 5

F.readPools = () => {
  socket.emit('get', {
    verb: 'read',
    subject: 'pool',
    user: Data.user.dbID
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

F.refreshChoices = names => {
  // randomize background colors (dark set on top, light on bottom)
  Help.$('.name-a').dataset.color = Math.ceil(Math.random() * colorNum) * 2 - 1
  Help.$('.name-b').dataset.color = Math.ceil(Math.random() * colorNum) * 2
  choices.forEach((choice, i) => {
    console.log(names[i])
    Help.$(`.name-${choice} h2`).innerText = Data.names[names[i]].name
    Help.$(`.name-${choice} h2`).dataset.value = names[i]
  })
  F.showChoices()
}

F.newPoolMatch = () => {
  const allPools = Data.pools.join(',').split(',')
  const poolSize = Data.pools[0].length
  const poolOngoing = Object.keys(Data.names).some(id => {
    const poolPosition = allPools.indexOf(id)
    const poolNum = Math.floor(poolPosition / poolSize)
    return Data.pools[poolNum].some(name => {
      if (id !== name && Data.names[id][Data.user.user].matches[name] === undefined) {
        F.refreshChoices([id, name])
        return true
      }
    })
  })
  if (!poolOngoing) {
    alert('pool play is done!')
  }
}

F.resolvePoolMatch = (id) => {
  // do cool stuff with id of winning name
}

F.readBrackets = () => {
}

F.resolveBracketMatch = () => {
}

export default F