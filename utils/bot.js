const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)

function sendMess({chat_id, message}){
    bot.telegram.sendMessage(chat_id, message)
}

module.exports ={
    sendMess
}