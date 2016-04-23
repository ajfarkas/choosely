const config = {
  development: {
    port: 8008,
    ip: '127.0.0.1',
    db: './choicesdb',
    token: null,
    prettyHtml: true
  }
}

module.exports = config['development']