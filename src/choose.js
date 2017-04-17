// import Help from './helpers/helpers'
import init from './helpers/init'
import F from './helpers/func_choose'
// import setHandlers from './realtime/socketHandlers'

// init(setHandlers)
init( F.readPools.bind(null, F.listen) )

// function hideChoices() {
//   // set bg to selected choice bg
//   const chosen = Help.$('.chosen')
//   curtain.setAttribute('style',
//     `background-image: ${getComputedStyle(chosen).backgroundImage}; display: block;`
//   )
//   // fade out names
//   choices.forEach(choice => {
//     Help.$(`.name-${choice}`).setAttribute('style', 'transition: none; opacity: 0;')
//   })
//   chosen.className = chosen.className.replace(' chosen', '')
//   // replace names with new set
//   if (Data.pools.length) {
//     F.newPoolMatch()
//   } else if (Data.bracket.length) {
//     F.newBracketMatch()
//   } else {
//     const remaining = Object.keys(Data.firstnames).filter(name => 
//       !Data.firstnames[name][Data.user.user].eliminated)
//     if (remaining.length > 1) {
//       F.readBracket()
//     } else {
//       alert(`We have a winner!\nCongrats to ${Data.firstnames[remaining].name}!`)
//     }
//   }
//   listen(true)
// }

// function choose(choice) {
//   // stop multiple choices before new names are shown
//   listen(false)
//   // allow for event Listeners or manual choice
//   if (choice.isTrusted) {
//     choice = this
//   }
//   const choiceID = Help.$('h2', choice).dataset.value
//   const lastnameID = Help.$('h3', choice).dataset.value

//   choice.className += ' chosen'
//   // allow for .chosen animation (see _choose.scss)
//   setTimeout(hideChoices, 1650)
//   if (Data.pools.length) {
//     F.resolvePoolMatch(choiceID, lastnameID)
//   } else if (Data.bracket.length) {
//     F.resolveBracketMatch(choiceID, lastnameID)
//   } else {
//     return console.error('Choose: both brackets and pools are unavailable')
//   }
//   return true
// }

// function cycleLastname(choice) {
//   if (choice.isTrusted) {
//     choice.stopPropagation()
//     choice = this
//   }
//   const lname = choice.dataset.value,
//         lastnames = Object.keys(Data.lastnames),
//         i = lastnames.indexOf(lname),
//         newName = lastnames[(i + 1) % lastnames.length]

//   choice.innerText = Data.lastnames[newName].name
//   choice.dataset.value = newName
// }

// function keyChoose(e) {
//   if (Help.$('.chosen')) {
//     return false
//   }
//   if (e.keyCode === 37) {
//     choose(Help.$('.name-a'))
//   } else if (e.keyCode === 39) {
//     choose(Help.$('.name-b'))
//   } else if (e.keyCode === 38 && Object.keys(lastnames).length > 1) {
//     cycleLastname(Help.$('.name-a h3'))
//   } else if (e.keyCode === 40 && Object.keys(lastnames).length > 1) {
//     cycleLastname(Help.$('.name-b h3'))
//   }
// }

// // add listeners
// listen = add => {
//   const op = add ? 'add' : 'remove'
//   choices.forEach(choice => {
//     Help.$(`.name-${choice}`)[`${op}EventListener`]('click', choose)
//     Help.$(`.name-${choice} h3`)[`${op}EventListener`]('click', cycleLastname)
//   })

//   document[`${op}EventListener`]('keydown', keyChoose)
//   console.log(`${op}EventListener`)
// }
