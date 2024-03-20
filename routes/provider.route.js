const Router = require('express').Router()
const { findAll } = require('@controllers/provider.controller')
const authGuard = require('@middlewares/auth-guard')

Router
    .use(authGuard)
    .get('/', findAll)

module.exports = { Router, route: '/provider' }