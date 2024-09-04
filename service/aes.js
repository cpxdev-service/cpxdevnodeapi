const crypto = require('crypto')

const key = crypto
  .createHash('sha512')
  .update(process.env.SECRET_KEY)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(process.env.SECRET_IV)
  .digest('hex')
  .substring(0, 16)

function enc(data) {
    const cipher = crypto.createCipheriv(process.env.ECNRYPTION_METHOD, key, encryptionIV)
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64')
}
function dec(encryptedData) {
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = crypto.createDecipheriv(process.env.ECNRYPTION_METHOD, key, encryptionIV)
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ) // Decrypts data and converts to utf8
}

module.exports = {
  encode: enc,
  decode: dec
};
