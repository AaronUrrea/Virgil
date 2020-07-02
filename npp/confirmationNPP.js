const Discord = require('discord.js');
const config = require('../config.json');

//These are the possible files they can choose to execute
const info = require('./infoNPP.js');
const rules = require('./rulesNPP.js')

module.exports.run = async (bot, args, player, channel) => {
    
    //Create confirmation embed to be sent
    let confirmEmbed = new Discord.MessageEmbed()
        .setColor('#ff9900')
        .setTitle('111th Manticore Company')
        .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setDescription('Are you sure you do not want to join the 11th Manticore Company?')
        .setThumbnail('attachment://Manticore.png')
	    .addFields(
            { name: ('You can change your mind at anytime by contacting me or any @Recruiter after these initial checks?\n'),  
                    value : '[✔️] "Yes, I am sure!\n[🔜] "No, I would like to check out 111th Manticore."' +
                    '\nThis message will auto-resolve after 1 minute of inactivity.' })
        
    //Send confirmEmbed, initialize new promise as confirmMessage
    confirmMessage = await channel.send(confirmEmbed)

    //Reacts two reactions to confirmMessage
    await confirmMessage.react('✔️')
    .then(confirmMessage.react('🔜'))

    //This is the filter that determines the emojis and the original member
    const filter = (reaction, user) => {
            return ['✔️', '🔜'].includes(reaction.emoji.name) && user.id === player.id;
    }

    //This waits for a reaction by using the emoji and user from the filter
    //  It will send an error after 1 minutes and auto-resolve
    await confirmMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();

        //If the user decides to check out Manticore, redirect to info
        if (reaction.emoji.name === '🔜') {
            confirmMessage.delete()
            .then(info.run(bot, '', player, channel))
        }

        //If the user decides to not check out Manticore, redirect to rules
        else if(reaction.emoji.name === '✔️') { 
            confirmMessage.delete()
            .then(rules.run(bot,'civilian', player, channel))
        }})

    //If the user times out after 5 minutes, redirect to communities, interpreting as a no
    .catch(collected => {
        confirmMessage.delete()
        .then(rules.run(bot,'civilian', player, channel))
    })
}

module.exports.config = {
    name: "confirmation"
}