const F = {}

F.calcTotalMatches = () => {
  const names = Object.keys(Data.firstnames),
        pools = Data.pools.length,
        poolMatches = Data.pools[0].map((_, i) => i).reduce((a, b) => a + b),
        bracketMatches = names.length - 1

  return (poolMatches * pools) + bracketMatches
}

F.calcMatchesPlayed = () => {
  const user = Data.user.user,
        names = Object.keys(Data.firstnames)
  let matchesPlayed = 0

  names.forEach(name => {
    Object.keys(Data.firstnames[name][user].matches).forEach(match => {
      matchesPlayed += Data.firstnames[name][user].matches[match]
    })
  })

  return matchesPlayed
}

export default F