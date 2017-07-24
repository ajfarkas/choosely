import Names from './fetch_names'
import Choose from './fetch_choose'

function clearMatchData() {
  const yesClear = window.confirm(
`Are you sure you want to clear all of the saved match data?
All names will be saved, but you will have to play all the matches again.`
  )
  if (yesClear) {
    let completedCalls = 0
    const checkCallsComplete = () => {
      completedCalls++
      if (completedCalls === 3) {
        location.pathname = '/choose/first'
      }
    }

    Object.keys(Data.firstnames).forEach(name => {
      Data.firstnames[name][Data.user.user] = {
        score: 0,
        matches: {},
        lastnames: {},
        eliminated: false
      }
    })
    Names.update(Data.firstnames, 'first', checkCallsComplete)
    Choose.delete('pools', checkCallsComplete)
    Choose.delete('bracket', checkCallsComplete)
  }
}

export default {
  setupClearData: () => {
    document.getElementById('clear-data').addEventListener('click', clearMatchData)
  }
}