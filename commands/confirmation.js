const Discord = require('discord.js');
const config = require('../config.json');
const info = require('./info.js');
const communities = require('./communities.js')

module.exports.run = async (bot, message, args, player, channel) => {
    
    try{
        await message.delete();
    }
    catch(error){
        console.log("Message delete failure.")
    } 
    
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
                    '\nThis message will auto-resolve after 5 minutes of inactivity.' })
        
    confirmMessage = await channel.send(confirmEmbed)

    await confirmMessage.react('✔️')
    .then(confirmMessage.react('🔜'))

    const filter = (reaction, user) => {
            return ['✔️', '🔜'].includes(reaction.emoji.name) && user.id === player.id;

    }

    await confirmMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();

        if (reaction.emoji.name === '🔜') {
            confirmMessage.delete()
            .then(console.log("User wants to check out Manticore. Redirecting to info"))
            .then(info.run(bot, message, 'index', player, channel))
        }
        else if(reaction.emoji.name === '✔️') { 
            confirmMessage.delete()
            .then(console.log("User does not want to check out Manticore. Redirecting to communities"))
            .then(communities.run(bot, message, 'conf', player, channel))
        }})
        .catch(collected => {
            confirmMessage.delete()
            .then(console.log("User did not react. Interpreting absence as complete. Directing to Communities"))
            .then(communities.run(bot, message, 'conf', player, channel))
        })
        
}

module.exports.config = {
    name: "confirmation"
}