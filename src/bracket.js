import init from './helpers/init'
import F from './helpers/func_choose'

function buildDisplay(data) {
  const display = document.querySelector('.display')

  data.bracket.forEach((round, i) => {
    const bracketRound = document.createElement('div')
    bracketRound.className = 'bracket-round'
    bracketRound.dataset.bracket = i

    round.forEach((match, j) => {
      const bracketMatch = document.createElement('div')
      bracketMatch.className = 'bracket-match'
      bracketMatch.dataset.bracket = `${i};${j}`

      match.forEach((id, k) => {
        const bracketName = document.createElement('p'),
              nameObj = Data.firstnames[id]
        bracketName.className = 'bracket-name' 
        bracketName.dataset.bracket = `${i};${j};${nameObj ? k ? 'b' : 'a' : 'bye'}`
        bracketName.innerText = nameObj
          ? nameObj.name
          : 'bye'
        bracketMatch.append(bracketName)
      })

      bracketRound.append(bracketMatch)
    })

    display.append(bracketRound)
  })
}

init(F.readBracket.bind(null, buildDisplay))