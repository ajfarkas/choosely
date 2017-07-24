import Help from './helpers'
import Names from './fetch_names'
import Choose from './fetch_choose'
import Progress from './func_progress'

const F = {}
const choices = ['a', 'b']
const curtain = Help.$('.curtain')
// number of color pairs in CSS file
const colorNum = 5

let matchType = 'pools'

F.readPools = (cb) => {
  Choose.read('pools', data => {
    Object.assign(Data, data)
    if (typeof cb === 'function') {
      cb(data)
    }
  })
}

function newBracketMatch(data) {
  if (data.matches[0].length === 1) {
    F.listen(false)
    alert(`We have a winner!\nCongrats to ${Data.firstnames[data.matches[0]].name}!`)
  } else {
    F.newBracketMatch()
  }
}

F.readBracket = (cb) => {
  Choose.read('bracket', data => {
    Object.assign(Data, data)
    if (typeof cb === 'function') {
      cb(data)
    }
  })
}

F.choose = choice => {
  // stop multiple choices before new names are shown
  F.listen(false)
  // allow for event Listeners or manual choice
  if (choice.isTrusted) {
    choice = choice.currentTarget
  }
  const choiceID = Help.$('h2', choice).dataset.value
  const lastnameID = Help.$('h3', choice).dataset.value

  Help.$('.name', choice).addEventListener('animationend', F.hideChoices)

  choice.className += ' chosen'

  if (matchType === 'pools') {
    F.resolvePoolMatch(choiceID, lastnameID)
  } else if (matchType === 'bracket') {
    F.resolveBracketMatch(choiceID, lastnameID)
  } else {
    return console.error('Choose: both brackets and pools are unavailable')
  }
  return true
}

F.keyChoose = e => {
  if (Help.$('.chosen')) {
    return false
  }
  if (e.keyCode === 37) {
    F.choose(Help.$('.name-a'))
  } else if (e.keyCode === 39) {
    F.choose(Help.$('.name-b'))
  } else if (e.keyCode === 38 && Object.keys(Data.lastnames).length > 1) {
    F.cycleLastname(Help.$('.name-a h3'))
  } else if (e.keyCode === 40 && Object.keys(Data.lastnames).length > 1) {
    F.cycleLastname(Help.$('.name-b h3'))
  }
}

F.cycleLastname = choice => {
  if (choice.isTrusted) {
    choice.stopPropagation()
    choice = choice.currentTarget
  }
  const lname = choice.dataset.value,
        lastnames = Object.keys(Data.lastnames),
        i = lastnames.indexOf(lname),
        newName = lastnames[(i + 1) % lastnames.length]

  choice.innerText = Data.lastnames[newName].name
  choice.dataset.value = newName
}

// add listeners
F.listen = add => {
  const op = add ? 'add' : 'remove'
  choices.forEach(choice => {
    Help.$(`.name-${choice}`)[`${op}EventListener`]('click', F.choose)
    Help.$(`.name-${choice} h3`)[`${op}EventListener`]('click', F.cycleLastname)
  })

  document[`${op}EventListener`]('keydown', F.keyChoose)
  console.log(`${op}EventListener`)
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

F.hideChoices = () => {
  // set bg to selected choice bg
  const chosen = Help.$('.chosen')
  Help.$('.name', chosen).removeEventListener('animationend', F.hideChoices)

  curtain.setAttribute('style',
    `background-image: ${getComputedStyle(chosen).backgroundImage}; display: block;`
  )
  // fade out names
  choices.forEach(choice => {
    Help.$(`.name-${choice}`).setAttribute('style', 'transition: none; opacity: 0;')
  })
  chosen.className = chosen.className.replace(' chosen', '')
  // replace names with new set
  if (matchType === 'pools') {
    F.newPoolMatch()
  } else if (matchType === 'bracket') {
    F.newBracketMatch()
  } else {
    const remaining = Help.getWinner('user')
    if (remaining.length > 1) {
      F.readBracket(newBracketMatch)
    }
  }
  F.listen(true)
}

F.refreshChoices = (index) => {
  Data.currentMatch = index
  const names = Data.matches[index],
        lastnames = Object.keys(Data.lastnames),
        lnLen = lastnames.length

  // randomize background colors (dark set on top, light on bottom)
  Help.$('.name-a').dataset.color = Math.ceil(Math.random() * colorNum) * 2 - 1
  Help.$('.name-b').dataset.color = Math.ceil(Math.random() * colorNum) * 2
  choices.forEach((choice, i) => {
    console.log(names[i])
    const lastIndex = Math.floor(Math.random() * lnLen)
    // set firstnames
    Help.$(`.name-${choice} h2`).innerText = Data.firstnames[names[i]].name
    Help.$(`.name-${choice} h2`).dataset.value = names[i]
    // set lastnames
    Help.$(`.name-${choice} h3`).innerText = lnLen 
      ? Data.lastnames[lastnames[lastIndex]].name
      : ''
    Help.$(`.name-${choice} h3`).dataset.value = lnLen
      ? lastnames[lastIndex]
      : null
  })
  F.showChoices()
}

F.newPoolMatch = () => {
  console.log('new pool match')
  const poolLen = Data.matches.length
  if (poolLen) {
    const index = Math.floor(Math.random() * poolLen)
    F.refreshChoices(index)
  } else {
    console.log('pool play is done!')
    matchType = 'bracket'
    F.readBracket(newBracketMatch)
  }
}

F.resolvePoolMatch = (id, lastnameID) => {
  const match = Data.matches[Data.currentMatch]
  match.forEach((contestant, i) => {
    const nameData = Data.firstnames[contestant][Data.user.user]
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
    Names.update(Data.firstnames[contestant], 'first')
  })
  Data.matches.splice(Data.currentMatch, 1)

  console.log(`${Progress.calcMatchesPlayed()}/${Progress.calcTotalMatches()}`)
  
  Choose.update(Data.matches, 'pools')
}

F.newBracketMatch = () => {
  console.log('new bracket match')
  const bracketLen = Data.matches.length
  if (bracketLen) {
    const index = Math.floor(Math.random() * bracketLen)
    F.refreshChoices(index)
  } else {
    F.readBracket(newBracketMatch)
  }
}

F.resolveBracketMatch = (id, lastnameID) => {
  const match = Data.matches[Data.currentMatch]
  match.forEach((contestant, i) => {
    const nameData = Data.firstnames[contestant][Data.user.user]
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
    Names.update(Data.firstnames[contestant], 'first')
  })
  Data.matches.splice(Data.currentMatch, 1)

  console.log(`${Progress.calcMatchesPlayed()}/${Progress.calcTotalMatches()}`)

  Choose.update(Data.matches, 'bracket')
}

export default F