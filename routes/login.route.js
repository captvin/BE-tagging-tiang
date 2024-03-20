const Router = require('express').Router()
const { login, changePass } = require('@controllers/login.controller')
const authGuard = require('@middlewares/auth-guard')

Router
    .post('/login', login)
    .use(authGuard).post('/changePass', changePass)

module.exports = { Router, route: '/user' }