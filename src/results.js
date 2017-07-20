import init from './helpers/init'

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
        )
  let you = undefined,
      partner = undefined,
      youName = undefined,
      partnerName = undefined

  for(let i = 0; i < namesLen; i++) {
    you = document.createElement('li')
    youName = Data.firstnames[userNames[i]]
    you.className = 'result'
    you.innerText = `${youName.name}: ${youName[Data.user.user].score}`
    userList.append(you)

    partner = document.createElement('li')
    partnerName = Data.firstnames[partnerNames[i]]
    partner.className = 'result'
    partner.innerText = `${partnerName.name}: ${partnerName[Data.user.partner].score}`
    partnerList.append(partner)
  }
}

init(displayNames)