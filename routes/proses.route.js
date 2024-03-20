const Router = require('express').Router()
const { findPole, tagging, getProv, getSTO } = require('@controllers/proses.controller')
const authGuard = require('@middlewares/auth-guard')
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({
  storage:storage
})

Router
    .use(authGuard)
    .get('/pole', findPole)
    .post('/tag',upload.fields([{name: "ODPImage", maxCount:1},{name: "ODCBImage", maxCount:1}, {name: "alproImage", maxCount:1}, {name: "poleImage", maxCount:1}, {name: "kudcImage", maxCount:1}]), tagging)
    .get('/provider', getProv)
    .get('/sto', getSTO)

module.exports = { Router, route: '/proses' } 