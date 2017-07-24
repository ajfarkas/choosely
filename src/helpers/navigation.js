import Names from './fetch_names'
import Choose from './fetch_choose'

function clearMatchData(skipModal) {
  const yesClear = `Are you sure you want to clear all of the saved match data?
All names will be saved, but you will have to play all the matches again.`
  if (skipModal === true || window.confirm(yesClear)) {
    let completedCalls = 0
    const checkCallsComplete = () => {
      completedCalls++
      if (completedCalls === 3) {
        location.pathname = '/create/first'
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
    return true
  }
}

export default {
  clearMatchData: clearMatchData,
  setupClearData: () => {
    document.getElementById('clear-data').addEventListener('click', clearMatchData)
  }
}