const Router = require('express').Router()
const { findAll } = require('@controllers/jenisTiang.controller')
const authGuard = require('@middlewares/auth-guard')

Router
    .use(authGuard)
    .get('/', findAll)

module.exports = { Router, route: '/jenis' }