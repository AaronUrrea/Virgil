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
    .setDescription('Are you sure you do not want to check out our Halo Arma 3 Company?')
    .setThumbnail('attachment://Manticore.png')
	.addFields(
        { name: ('You can change your mind at anytime by contacting me after these initial checks?\n'),  
                value : '[✔️] "Yes, I am sure!\n[🔜] "No, I would like to check out 111th Manticore."'})
    
    confirmMessage = await channel.send(confirmEmbed)

    await confirmMessage.react('✔️')
    .then(confirmMessage.react('🔜'))
}

module.exports.config = {
    name: "confirmation"
}