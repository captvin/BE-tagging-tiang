const jwt = require('jsonwebtoken')
const { Forbidden, Unauthorized } = require('http-errors')
const { ErrorHandler } = require('@middlewares/error-handler')

require('dotenv').config()
var { JWT_SECRET_KEY } = process.env

module.exports = function (req, res, next) {
    var token = req.headers.authorization
    if (token == undefined || null) {
        ErrorHandler(Unauthorized(), req, res)
    }
    else {
        token = token.slice(7)
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if (error) {
                ErrorHandler(Forbidden(), req, res)
            } else {
                const user = payload
                
                
                req.user = {
                    ...user,
                }
                next()
            }
        })
    }
}