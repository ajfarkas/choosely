import Help from './helpers/helpers'
import connect from './realtime/connect'
import setHandlers from './realtime/socketHandlers'
// connect socket.io
connect(setHandlers)

const choices = ['a', 'b']
const curtain = Help.$('.curtain')
const colorNum = 5

function showChoices() {
  // push solid bg to back so that names will be visible
  curtain.setAttribute('style', `${curtain.getAttribute('style')} z-index: -1;`)
  // hack to force transition animation
  setTimeout(() => {
    choices.forEach(choice => {
      Help.$(`.name-${choice}`).setAttribute('style', '')
    })
  }, 20)
}

function refreshChoices(names) {
  // randomize background colors (dark set on top, light on bottom)
  Help.$('.name-a').dataset.color = Math.ceil(Math.random() * colorNum) * 2 - 1
  Help.$('.name-b').dataset.color = Math.ceil(Math.random() * colorNum) * 2
  choices.forEach((choice, i) => {   
    Help.$(`.name-${choice} h2`).innerText = names[i]
    Help.$(`.name-${choice} h2`).dataset.value = names[i]
  })
  showChoices()
}

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
  refreshChoices(['Seamus', 'Alfred'])
}

function choose(choice) {
  if (choice.isTrusted) {
    choice = this
  }
  choice.className += ' chosen'
  // allow for .chosen animation (see _choose.scss)
  setTimeout(hideChoices, 1650)
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
