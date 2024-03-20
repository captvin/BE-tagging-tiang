
const {tagtiangbot_nomor_tiang_r5} = require('@models')

async function findAll(req, res, next) {
    const result = await tagtiangbot_nomor_tiang_r5.findAll({attributes:['nomor_tiang', 'deskripsi']})
    res.json(result)
}

module.exports = {
    findAll
}