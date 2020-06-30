const Discord = require('discord.js');
const config = require('../config.json');

//Merely just a test command

module.exports.run = async (bot, message, args) => {
    if(message.member.permissions.toArray().includes('ADMINISTRATOR')){
        message.channel.send(message.member.nickname + ` has a large pp`);
    console.log("[Virgil @ " + message.channel.name + "]: " + message.toString());
    }
    else{
        message.reply("You have insufficent permissions for this command.");
    }
}

module.exports.config = {
    name: "test"
}