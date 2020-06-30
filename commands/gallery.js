const Discord = require('discord.js');
const config = require('../config.json');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports.run = async (bot, message, args) => {
    
    var channelOrigin = message.channel;

    setTimeout(() => {
        message.delete();
        //channelOrigin is the channel of the original Message

        //Create a webhook, that puts four images into one message and sends it
        channelOrigin.createWebhook('Virgil', './attachments/Virgil.png')
        .then(w => w.send({embeds: [
            new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Accessing Gallery Now . . .')
                .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
                .setAuthor('UNSC', 'attachment://UNSC.png')
                .setThumbnail('attachment://Manticore.png'),

            new Discord.MessageEmbed().attachFiles(['./attachments/Gallery1.png'])
                                      .setColor('#ff9900')
                                      .setImage('attachment://Gallery1.png'),

            new Discord.MessageEmbed().attachFiles(['./attachments/Gallery2.png'])
                                      .setColor('#ff9900')
                                      .setImage('attachment://Gallery2.png'),

            new Discord.MessageEmbed().attachFiles(['./attachments/Gallery3.png'])
                                      .setColor('#ff9900')
                                      .setImage('attachment://Gallery3.png')
        ]}))
        
        //Here I wanna delete the webhook I originally made up there ^
        channelOrigin.fetchWebhooks()
            .then(hooks => { 
                console.log(hooks)
                hooks.delete()})
            .catch(console.error);
    }, 1000);
    

}



module.exports.config = {
    name: "gallery"
}