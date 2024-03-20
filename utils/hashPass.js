const { hash, genSalt } = require('bcrypt')
require('dotenv').config()
const {BCRYPT_SALT}= process.env

function hashPass(password) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await hash(password, await genSalt(Number(BCRYPT_SALT)))
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {hashPass}