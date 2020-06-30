const Discord = require('discord.js');
const config = require('../config.json');

//Merely just a test command

module.exports.run = async (bot, message, args) => {
    if(message.member.permissions.toArray().includes('ADMINISTRATOR')){
        let sent = await message.channel.send(new Discord.MessageEmbed()
            .setColor('#ff9900')
            .setTitle('111th Manticore Company')
            .setDescription('Permission granted, ' + message.member.nickname + '.\nYou have quite a large PP.')
            .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
            .setAuthor('UNSC', 'attachment://UNSC.png')
            .setThumbnail('attachment://Manticore.png'));
        
         await message.delete();

    console.log("[Virgil @ " + message.channel.name + "]: " + message.toString());
    }
    else{
        let sent = await message.channel.send(new Discord.MessageEmbed()
            .setColor('#ff9900')
            .setTitle('111th Manticore Company')
            .setDescription('Permission denied, ' + message.member.nickname + '.\nYou have quite a small PP.')
            .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
            .setAuthor('UNSC', 'attachment://UNSC.png')
            .setThumbnail('attachment://Manticore.png'));
        
        await message.delete();
    }
}

module.exports.config = {
    name: "test"
}