import Help from './helpers/helpers'
import connect from './realtime/connect'
import setHandlers from './realtime/socketHandlers'
// connect socket.io
connect(setHandlers)

const choices = ['a', 'b']
const curtain = Help.$('.curtain')
const colorNum = 5

function showChoices() {
  curtain.setAttribute('style', `${curtain.getAttribute('style')} z-index: -1;`)
  setTimeout(() => {
    choices.forEach(choice => {
      Help.$(`.name-${choice}`).setAttribute('style', '')
    })
  }, 20)
}

function refreshChoices(names) {
  Help.$('.name-a').dataset.color = Math.ceil(Math.random() * colorNum) * 2 - 1
  Help.$('.name-b').dataset.color = Math.ceil(Math.random() * colorNum) * 2
  choices.forEach((choice, i) => {   
    Help.$(`.name-${choice} h2`).innerText = names[i]
  })
  showChoices()
}

function hideChoices() {
  const chosen = Help.$('.chosen')
  curtain.setAttribute('style',
    `background-image: ${getComputedStyle(chosen).backgroundImage}; display: block;`
  )
  choices.forEach(choice => {
    Help.$(`.name-${choice}`).setAttribute('style', 'transition: none; opacity: 0;')
  })
  chosen.className = chosen.className.replace(' chosen', '')
  refreshChoices(['Seamus', 'Alfred'])
}

function choose() {
  this.className += ' chosen'
  setTimeout(hideChoices, 1650)
  return true
}

choices.forEach(choice => {
  Help.$(`.name-${choice}`).addEventListener('click', choose)
})