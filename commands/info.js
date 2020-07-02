const Discord = require('discord.js');
const config = require('../config.json');

const gallery = require('./gallery.js')

module.exports.run = async (bot, message, args, player, channel) => {
    
    try{
        message.delete()
        .catch(console.log("Failed to delete message"))
    }
    catch{}
    
    let infoEmbed = new Discord.MessageEmbed()
    .setColor('#ff9900')
    .setTitle('111th Manticore Company')
    .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
    .setAuthor('UNSC', 'attachment://UNSC.png')
    .setDescription('We are a gaming community that primarily focuses on Halo Operations in Arma 3.' +
                    'We also do a variety of operations that cycle throughout the weeks. Currently, we have:')
    .setThumbnail('attachment://Manticore.png')
	.addFields(
        { name: 'Marine Division', value: '"Hoplite"', inline: true },
        { name: 'Scout Divisions', value: '"Pathfinder" & "Chisel"', inline: true },
        { name: 'Air Division', value: '"Black Dragon"', inline: true },
        { name: 'Armor Division', value: '"Titan"', inline: true },
        { name: 'ODST  Division', value: '"Wyvern"', inline: true },
        { name: 'Talk to your @Recruiter today to see which slots are avaliable!', value: '\u200B'},
		{ name: '**SCHEDULE:**', value: '\u200B'},
        { name: 'Friday', value: 'Training, 7:30PM CST Load In, 8:00PM CST Briefing/Step Off.', inline: true },
        { name: 'Sunday', value: 'Story Operation, 7:30PM CST Load In, 8:00PM CST Briefing/Step Off.', inline: true },
        { name: 'BCT, Side Ops and Fun Ops are subject to change, and will be scheduled flexibly.', value: '\u200B'},   
        { name: 'Teamspeak:', value: 'IP: 185.249.196.154:9104 \nPassword: 9MILGAMINGAB'},
        { name: 'Arma 3:', value: 'IP: nanw-ogs3.armahosts.com:2582 \nPassword: 9MILGAMINGAB'},
        { name: ((player.nickname == null ? player.user.username : player.nickname) + 
                ', there are several actions you can select:'), 
                value: 
                    ('[✖] Close this window.\n[🔜] Visit the Gallery. '+
                     '\nThis message will auto-resolve after 5 minutes of inactivity.') })


    let infoMessage = await channel.send(infoEmbed)
    .then(console.log("Sending info to: " + player.user.username))

    //This reacts an X to the embeded message   

    await infoMessage.react('✖')
    .then(infoMessage.react('🔜'))

        //This is the filter that determines the emojis and the original member
    const filter = (reaction, user) => {
        return ['✖',  '🔜'].includes(reaction.emoji.name) && user.id === player.id;
    }


    //This waits for a reaction by using the emoji and user from the filter
    //It will send an error after 5 minutes and auto
    await infoMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();

        if (reaction.emoji.name === '✖') {
            infoMessage.delete()

        }
        else if(reaction.emoji.name === '🔜') {
            infoMessage.delete()
            .then(gallery.run(bot, '', 'info', player, channel))
        }})
    .catch(collected => {
        infoMessage.delete()

    });
}

module.exports.config = {
    name: "info"
}