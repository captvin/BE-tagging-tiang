const { Op } =require('sequelize')
const {tagtiangbot_provider} = require('@models')

async function findAll(req, res, next) {
   
    const options = {
        order: [
            ['id', 'ASC']
        ],
        where: {}
    }

    const { name } = req.query

    if (name) {
        options.where['name'] = { [Op.like]: `%${name}%` }
    }

    const result = await tagtiangbot_provider.findAll(options)
    res.json(result)
}

module.exports = {
    findAll
}