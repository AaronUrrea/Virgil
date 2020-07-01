const Discord = require('discord.js');
const config = require('../config.json');
const gallery = require('./gallery.js')
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

//


module.exports.run = async (bot, message, args) => {
    
    var channelOrigin = message.channel;
    var memberOrigin = message.member;
    var messageDuplicate = message;

    message.delete();
    
    let infoEmbed = new Discord.MessageEmbed()
    .setColor('#ff9900')
    .setTitle('111th Manticore Company')
    .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
    .setAuthor('UNSC', 'attachment://UNSC.png')
    .setDescription('We are a gaming community that primarily focuses on Halo Operations in Arma 3.' +
                    'We also do a variety of operations that cycle throughout the weeks. If your interested in being apart of' + 
                    'our fantastic community then head over to our **TeamSpeak: 185.249.196.154:9104** and hop into the **#Waiting' +
                    'For Recruiter** channel and a recruiter will be with you asap. Enjoy your stay!')
    .setThumbnail('attachment://Manticore.png')
	.addFields(
		{ name: '**SCHEDULE:**', value: '\u200B'},
		{ name: 'Monday', value: 'Free', inline: true },
        { name: 'Tuesday', value: 'Free', inline: true },
        { name: 'Wednesday', value: 'Free', inline: true },
        { name: 'Thursday', value: 'Free', inline: true },
        { name: 'Friday', value: 'Training', inline: true },
        { name: 'Saturday', value: 'Free', inline: true },
        { name: 'Sunday', value: 'Story Operation, 7:30PM Load CST, 8:00PM Briefing/Step Off', inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: (message.member.nickname + ', there are several actions you can select:'), 
                value: '[✖] Closes this window.\n[✔️] Advances to the Gallery. ', inline: true },
    )
    let infoMessage = await channelOrigin.send(infoEmbed)
    .then(console.log("Sending info to: " + memberOrigin.nickname))

    //This reacts an X to the embeded message   
    await infoMessage.react('✖')
        .then(infoMessage.react('✔️'))
        .then(console.log("Exit reaction assigned."))
        
            //This is the filter that determines the emojis and the original member
            const filter = (reaction, user) => {
                return ['✖', '✔️'].includes(reaction.emoji.name) && user.id === memberOrigin.id;
            };
            
    //This waits for a reaction by using the emoji and user from the filter
    //It will send an error after 60 seconds and auto
    await infoMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();
    
        if (reaction.emoji.name === '✖') {
            infoMessage.delete()
            .then(console.log("User reacted. Deleting message."))
        }
        else if(reaction.emoji.name === '✔️') {
            infoMessage.delete()
            .then(console.log("User reacted. Directing to Gallery."))
            .then(gallery.run(bot, message, args))
        }})
    .catch(collected => {
        infoMessage.delete()
        .then(console.log("User did not react. Deleting message.\n"))
    });
}

module.exports.config = {
    name: "info"
}