const { tagtiangbot_user_list} = require('@models')
const { tokenGenerator } = require('@utils/tokenGenerator')
const bcrypt = require('bcrypt');
const { hashPass } = require('@utils/hashPass')
const {format} = require('date-fns')

async function login(req, res, next) {

    // try{

    const { username } = req.body

    const result = await tagtiangbot_user_list.findOne({ where: { username } })
    if (!result) {
        return res.json({
            message: "User not found",
            code: 401
        });
    }


    const { password } = req.body
    const password_match = await bcrypt.compare(password, result.password)

    if (password_match) {
        const data = {
            id : result.id,
            id_telegram: result.id_telegram,
            username: result.username,
            role: result.role,
            name: result.name,
            witel: result.witel,
            description: result.description
        }
        const token = await tokenGenerator(data)

        const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        await tagtiangbot_user_list.update({last_login_at: now }, {where:{id: result.id}})

        return res.json({
            logged: true,
            data: result,
            token: token
        })
    }

    else {
        return res.json({
            message: "Wrong password",
            code: 402
        })
    }


}

async function getBy(req, res, next) {
    const {body} = req
    body.password = await hashPass(body.password)

    res.json(body.password)
}

module.exports = {
    login,
    getBy
}

