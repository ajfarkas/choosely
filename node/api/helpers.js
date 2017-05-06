// Backend API Helper Functions

module.exports = {
  // get ID used to store couple data in DB
  getTeamID: jwt => {
    return jwt.partner > jwt.user
      ? `${jwt.partner}_${jwt.user}`
      : `${jwt.user}_${jwt.partner}`
  },

  getCookies: req => {
    const cookies = {}
    
    req.headers.cookie.split('; ').forEach(cookie => {
      const data = cookie.split('=')
      cookies[data[0]] = data[1]
    })

    return cookies
  }
}