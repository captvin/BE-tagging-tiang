const { tagtiangbot_user_list} = require('@models')
const {Sequelize} = require('sequelize')
const { tokenGenerator } = require('@utils/tokenGenerator')
const bcrypt = require('bcrypt');
const { hashPass } = require('@utils/hashPass')
const {format} = require('date-fns')

async function login(req, res, next) {

    // try{
    console.log(req.body)

    const { username } = req.body

    const result = await tagtiangbot_user_list.findOne({ where: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('username')), username) })
    if (!result) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    // console.log(res)
    // console.log(res.header)


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
        return res.status(401).json({
            message: "Wrong password"
        })
    }


}

async function changePass(req, res, next) {
    const { oldPass, newPass } = req.body
    const id = req.user.id
    
    const check = await tagtiangbot_user_list.findByPk(id)

    const password_match = await bcrypt.compare(oldPass, check.password)

    if(password_match){
        const newPassEncrypt = await hashPass(newPass)
        const result = await tagtiangbot_user_list.update({password : newPassEncrypt}, {where: {id}})

        return result 
            ? res.status(200).json("Success")
            : res.status(500).json('Server Error')
    } else {
        return res.status(401).json("Password Salah")
    }
}

module.exports = {
    login,
    changePass
}

