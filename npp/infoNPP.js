const Discord = require('discord.js');
const config = require('../config.json');

//These are the possible files they can choose to execute
const gallery = require('./galleryNPP.js')
const rules = require('./rulesNPP.js');
const confirmation = require('./confirmationNPP.js');

module.exports.run = async (bot, args, player, channel) => {

    //Create infoEmbed to be sent
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
            { name: 'Teamspeak:', value: 'IP: 209.222.98.117:9027 \nPassword: 9MILGAMINGAB'},
            { name: 'Arma 3:', value: 'IP: nanw-ogs3.armahosts.com:2582 \nPassword: 9MILGAMINGAB'},
            { name: ('There are several actions you can select:'), 
                    value: ('[✖] "I do not want to be apart of Manticore".\n[✔️] "Sign me up for Manticore!"\n[🔜] Visit the Gallery. '+
                         '\nThis message will auto-resolve after 5 minutes of inactivity.') } )


    //Send infoEmbed, initialize new promise as infoMessage
    let infoMessage = await channel.send(infoEmbed)

    //Reacts three reactions to the embeded message       
    await infoMessage.react('✖')
        .then(infoMessage.react('✔️'))
        .then(infoMessage.react('🔜'))
    
    //This is the filter that determines the emojis and the original member
    const filter = (reaction, user) => {
        return ['✖', '✔️', '🔜'].includes(reaction.emoji.name) && user.id === player.id;
    }

    //This waits for a reaction by using the emoji and user from the filter
    //  It will send an error after 5 minutes and auto-resolve
    await infoMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();
        
        //If they refuse, direct them to the confirmation window
        if (reaction.emoji.name === '✖'){
            infoMessage.delete()
            .then(confirmation.run(bot, '', player, channel))
        }

        //If they accept, direct them to the communities window        
        else if(reaction.emoji.name === '✔️') {
            infoMessage.delete()
            .then(rules.run(bot, 'marine', player, channel))
        }

        //If they click soon, direct them to the gallery
        else if(reaction.emoji.name === '🔜') {
            infoMessage.delete()
            .then(gallery.run(bot, '', player, channel))
    }})

    //If the user times out after 5 minutes, redirect to communities, interpreting as a yes       
    .catch(collected => {
        infoMessage.delete()
        .then(rules.run(bot, 'marine', player, channel))
    });
}

module.exports.config = {
    name: "info"
}