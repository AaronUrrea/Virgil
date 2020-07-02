const Discord = require('discord.js');
const config = require('../config.json');

const gallery = require('./gallery.js')
const communites = require('./communities.js');
const confirmation = require('./confirmation.js');

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
    .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'/*, './attachments/Sheet.png'*/])
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
                value: (args === 'index' || args === 'gallery' ?
                    ('[✖] "I do not want to be apart of Manticore".\n[✔️] "Sign me up for Manticore!"\n[🔜] Visit the Gallery. '+
                     '\nThis message will auto-resolve after 5 minutes of inactivity.') : 
                     ((player.nickname == null ? player.user.username : player.nickname) +', click [✖] to exit this menu.'+
                     '\nThis message will auto-resolve after 5 minutes of inactivity.') )})
        //.setImage('attachment://Sheet.png')

    let infoMessage = await channel.send(infoEmbed)
    .then(console.log("Sending info to: " + player.user.username))

    //This reacts an X to the embeded message   
    if(args === 'index' || args === 'gallery'){
        await infoMessage.react('✖')
            .then(infoMessage.react('✔️'))
            .then(infoMessage.react('🔜'))
            .then(console.log("Deny + Accept + Gallery reactions assigned"))
    }
    else{
        await infoMessage.react('✖')
        .then(console.log("Exit + Gallery reactions assigned"))
    }
        
        //This is the filter that determines the emojis and the original member
        const filter = (reaction, user) => {
            if(args === 'index' || args === 'gallery'){
                return ['✖', '✔️', '🔜'].includes(reaction.emoji.name) && user.id === player.id;
            }
            else{
                return ['✖'].includes(reaction.emoji.name) && user.id === player.id;
            }
        }


            
    //This waits for a reaction by using the emoji and user from the filter
    //It will send an error after 5 minutes and auto
    await infoMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();
        
        if (reaction.emoji.name === '✖' && (args === 'index' || args === 'gallery')) {
            infoMessage.delete()
            .then(console.log("User denied. Sending to confirmation."))
            .then(confirmation.run(bot, message, 'info', player, channel))
        }
        else if (reaction.emoji.name === '✖' && args != 'index') {
            infoMessage.delete()
            .then(console.log("User denied. Exiting window"))
        }
        else if(reaction.emoji.name === '✔️') {
            infoMessage.delete()
            .then(console.log("User accepted. Directing to communities\n"))
            .then(communites.run(bot, message, 'info', player, channel))
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