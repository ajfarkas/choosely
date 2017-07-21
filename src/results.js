import init from './helpers/init'

function highlightName(e) {
  console.log('hilite', e.type)
  document.querySelectorAll(`[data-id="${e.currentTarget.dataset.id}"]`).forEach(nameEl => {
    nameEl.classList.toggle('is-selected')
  })
}

function displayNames() {
  const userList = document.querySelector('.user-results'),
        partnerList = document.querySelector('.partner-results'),
        names = Object.keys(Data.firstnames),
        namesLen = names.length,
        userNames = names.sort((a,b) =>
          Data.firstnames[a][Data.user.user].score < Data.firstnames[b][Data.user.user].score
        ),
        partnerNames = names.sort((a,b) =>
          Data.firstnames[a][Data.user.partner].score < Data.firstnames[b][Data.user.partner].score
        ),
        youScoreMax = Math.max(...names.map(name => Data.firstnames[name][Data.user.user].score)),
        partnerScoreMax = Math.max(...names.map(name => Data.firstnames[name][Data.user.partner].score))
  let you = undefined,
      partner = undefined,
      youName = undefined,
      partnerName = undefined

  for(let i = 0; i < namesLen; i++) {
    you = document.createElement('li')
    youName = Data.firstnames[userNames[i]]
    you.className = 'result'
    you.style.backgroundColor = `rgba(255,255,255,${youName[Data.user.user].score/youScoreMax})`
    you.dataset.id = userNames[i]
    you.innerText = `${youName.name}: ${youName[Data.user.user].score}`
    userList.append(you)
    you.addEventListener('mouseenter', highlightName)
    you.addEventListener('mouseout', highlightName)

    partner = document.createElement('li')
    partnerName = Data.firstnames[partnerNames[i]]
    partner.className = 'result'
    partner.style.backgroundColor = `rgba(255,255,255,${partnerName[Data.user.partner].score/partnerScoreMax})`
    partner.dataset.id = partnerNames[i]
    partner.innerText = `${partnerName.name}: ${partnerName[Data.user.partner].score}`
    partnerList.append(partner)
    partner.addEventListener('mouseenter', highlightName)
    partner.addEventListener('mouseout', highlightName)
  }
}

init(displayNames)