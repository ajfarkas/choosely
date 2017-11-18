const config = {
  development: {
    port: process.env.PORT || 8008,
    ip: '127.0.0.1',
    db: './choicesdb',
    token: null,
    prettyHtml: true,
    secret: 'TOP_SECRET',
    tokenExpLen: 1209600
  }
}

module.exports = config.development