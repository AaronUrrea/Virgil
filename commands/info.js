const Discord = require('discord.js');
const config = require('../config.json');

const gallery = require('./gallery.js')
const communites = require('./communities.js');

const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports.run = async (bot, message, args, player, channel) => {

    try{
        await message.delete();
    }
    catch(error){
        console.log("Message delete failure.")
    } 
    
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
        { name: 'Friday', value: 'Training, 7:30PM CST Load In, 8:00PM CST Briefing/Step Off.', inline: true },
        { name: 'Sunday', value: 'Story Operation, 7:30PM CST Load In, 8:00PM CST Briefing/Step Off.', inline: true },
        { name: '\u200B', value: 'BCT, Side Ops and Fun Ops are subject to change, and will be scheduled flexibly.'},   
        { name: '\u200B', value: '\u200B' },
        { name: ((player.nickname == null ? player.user.username : player.nickname) + 
                ', there are several actions you can select:'), 
                value: '[✖] Closes this window.\n[✔️] Advances to the Gallery. '+
                '\nThis message will auto-delete in 5 Minutes.'},
    )

    let infoMessage = await channel.send(infoEmbed)
    .then(console.log("Sending info to: " + player.nickname))

    //This reacts an X to the embeded message   
    if(args === 'index' || args === 'gallery'){
        await infoMessage.react('✖')
            .then(infoMessage.react('✔️'))
            .then(infoMessage.react('🔜'))
            .then(console.log("Deny + Accept + Gallery reactions assigned"))
    }
    else{
        await infoMessage.react('✖')
        .then(infoMessage.react('🔜'))
        .then(console.log("Exit + Gallery reactions assigned"))
    }
        
        //This is the filter that determines the emojis and the original member
        const filter = (reaction, user) => {
            if(args === 'index' || args === 'gallery'){
                return ['✖', '✔️', '🔜'].includes(reaction.emoji.name) && user.id === player.id;
            }
            else{
                return ['✖', '🔜'].includes(reaction.emoji.name) && user.id === player.id;
            }
        }

            
    //This waits for a reaction by using the emoji and user from the filter
    //It will send an error after 5 minutes and auto
    await infoMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();
        
        if (reaction.emoji.name === '✖') {
            infoMessage.delete()
            .then(console.log("User reacted. Deleting message."))
        }
        else if(reaction.emoji.name === '✔️') {
            infoMessage.delete()
            .then(console.log("User accepted. Directing to communities\n"))
            .then(communities.run(bot, message, 'info', player, channel))
        }
        else if(reaction.emoji.name === '🔜') {
            infoMessage.delete()
            .then(console.log("User reacted. Directing to gallery\n"))
            .then(gallery.run(bot, message, 'info', player, channel))
        }})
    .catch(collected => {
        infoMessage.delete()
        .then(console.log("User did not react. Interpreting abcense as a no. Directing to communities\n"))
    });
}

module.exports.config = {
    name: "info"
}