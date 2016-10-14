const nodemailer = require('nodemailer'),
      smtpConfig = require('../config/smtp'),
      transporter = nodemailer.createTransport(smtpConfig)

module.exports = {
  /* mail.send
   * Exposes nodemailer transporter object send function
   * Args:
   *   - data (`obj`): (see nodemailer docs for full list)
   *     - from (`str`): valid e-mail address
   *     - to (`str`): valid email address
   *     - subject (`str`): email subject line
   *     - text (`str`): plaintext version of email as unicode string, buffer, or stream
   *     - html (`str`): HTML version of email as unicode string, buffer, or stream
   *   - cb (`function`): callback function
  */
  send: (data, cb) => {
    if (!data) {
      return console.error('mail.send: must include email data object.')
    }

    data.from = data.from || smtpConfig.auth.user

    if (typeof cb !== 'function') {
      cb = (err, info) => {
        if (err) {
          return console.error(`mail.send ${err}`)
        }

        if (info.accepted && info.accepted.length) {
          console.log(`mail sent: ${info.accepted}`)
        }
        if (info.rejected && info.rejected.length) {
          console.log(`mail rejected: ${info.rejected}`)
        }
      }
    }

    return transporter.sendMail(data, cb)
  }
}