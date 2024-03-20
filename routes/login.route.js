const Router = require('express').Router()
const { login, getBy } = require('@controllers/login.controller')

Router
    .post('/login', login)
    .post('/getBy', getBy)

module.exports = { Router, route: '/user' }