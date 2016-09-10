import Help from './helpers/helpers'
import connect from './realtime/connect'
import F from './helpers/func_choose'
import setHandlers from './realtime/socketHandlers'
// connect socket.io
connect(setHandlers)

const choices = ['a', 'b']
const curtain = Help.$('.curtain')

function hideChoices() {
  // set bg to selected choice bg
  const chosen = Help.$('.chosen')
  curtain.setAttribute('style',
    `background-image: ${getComputedStyle(chosen).backgroundImage}; display: block;`
  )
  // fade out names
  choices.forEach(choice => {
    Help.$(`.name-${choice}`).setAttribute('style', 'transition: none; opacity: 0;')
  })
  chosen.className = chosen.className.replace(' chosen', '')
  // replace names with new set
  if (Data.pools.length) {
    F.newPoolMatch()
  } else if (Data.bracket.length) {
    F.newBracketMatch()
  } else {
    const remaining = Object.keys(Data.names).filter(name => 
      !Data.names[name][Data.user.user].eliminated)
    if (remaining.length > 1) {
      F.readBracket()
    } else {
      alert(`We have a winner!\nCongrats to ${Data.names[remaining].name}!`)
    }
  }
}

function choose(choice) {
  // allow for event Listeners or manual choice
  if (choice.isTrusted) {
    choice = this
  }
  const choiceID = choice.querySelector('h2').dataset.value

  choice.className += ' chosen'
  // allow for .chosen animation (see _choose.scss)
  setTimeout(hideChoices, 1650)
  if (Data.pools.length) {
    F.resolvePoolMatch(choiceID)
  } else if (Data.bracket.length) {
    F.resolveBracketMatch(choiceID)
  } else {
    return console.error('Choose: both brackets and pools are unavailable')
  }
  return true
}

function cycleLastname(choice) {
  if (choice.isTrusted) {
    choice.stopPropagation()
    choice = this
  }
  const lname = choice.dataset.value
  const i = Data.lastnames.indexOf(lname)
  // console.log(lname, i, i % Data.lastnames.length)
  const newName = Data.lastnames[(i + 1) % Data.lastnames.length]
  choice.innerText = newName
  choice.dataset.value = newName
}

// listeners
choices.forEach(choice => {
  Help.$(`.name-${choice}`).addEventListener('click', choose)
  Help.$(`.name-${choice} h3`).addEventListener('click', cycleLastname)
})

document.addEventListener('keydown', e => {
  if (Help.$('.chosen')) {
    return false
  }
  if (e.keyCode === 37) {
    choose(Help.$('.name-a'))
  } else if (e.keyCode === 39) {
    choose(Help.$('.name-b'))
  } else if (e.keyCode === 38 && Data.lastnames.length > 1) {
    cycleLastname(Help.$('.name-a h3'))
  } else if (e.keyCode === 40 && Data.lastnames.length > 1) {
    cycleLastname(Help.$('.name-b h3'))
  }
})
