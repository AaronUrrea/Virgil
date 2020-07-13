const Discord = require('discord.js');
const config = require('../config.json');

//Merely just a test command

module.exports.run = async (bot, message, args, player, channel) => {

    let sentHelp = await message.channel.send(new Discord.MessageEmbed()
        .setColor('#ff9900')
        .setTitle('111th Manticore Company')
        .setDescription(`<@${player.id}>` + ', this is a test using mentions')
        .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setThumbnail('attachment://Manticore.png')
        .addFields(
            { name: "\u200B", value: 'Click [✖] to exit.' +
            '\nThis message will auto-delete in 1 minute.'}))
        
    sentHelp.react('✖');

    const filter = (reaction, user) => {
        return ['✖'].includes(reaction.emoji.name) && user.id === player.id;
    }

    await sentHelp.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();

        if(reaction.emoji.name === '✖'){
            sentHelp.delete()
        }
    })
    .catch(collected => {
        sentHelp.delete()
    });

}

module.exports.config = {
    name: "test"
}