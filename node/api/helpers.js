// Backend API Helper Functions

module.exports = {
  // get ID used to store couple data in DB
  getTeamID: jwt => {
    return jwt.partner > jwt.user
      ? `${jwt.partner}_${jwt.user}`
      : `${jwt.user}_${jwt.partner}`
  }
}