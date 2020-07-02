const Discord = require('discord.js');

//These are the possible files they can choose to execute
const config = require('../config.json');
const info = require('./infoNPP.js')

module.exports.run = async (bot, args, player, channel) => {
    
    try {

        //Creates a webhook in the channel, capable of putting multiple embeds in one message
        await channel.createWebhook('Virgil', {
            avatar: './attachments/Virgil.png'
        })

        //Gets the singular webhook from the list of webhooks, and assigns it to 'webhook'
        const webhooks = await channel.fetchWebhooks();
        const webhook = await webhooks.first();

        //Creates tempGallery, a temporary message for the sakes of aesthetics
        let tempGallery = await channel.send(new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Permission granted, ' + 
                    (player.nickname == null ? player.user.username : player.nickname) +
                    '.\nAccessing Gallery Now . . .')
                .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
                .setAuthor('UNSC', 'attachment://UNSC.png')
                .setThumbnail('attachment://Manticore.png'))

        //Creates embedMessage, which uses the webhook to create a maximum of 10 embeds to be sent
        let embedMessage = await webhook.send({embeds: [
            new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Permission granted, ' + 
                    (player.nickname == null ? player.user.username : player.nickname) +
                    '.\nAccessing Gallery Now . . .')
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
                                      .setImage('attachment://Gallery3.png'),

            new Discord.MessageEmbed().attachFiles(['./attachments/Gallery4.png'])
                                      .setColor('#ff9900')
                                      .setImage('attachment://Gallery4.png'),                          
                                      
            new Discord.MessageEmbed()
                                      .setColor('#ff9900')
                                      .setTitle('111th Manticore Company')
                                      .setDescription((player.nickname == null ? player.user.username : player.nickname) + 
                                                     ', Click [🔙] to return to info.' +
                                                     '\nThis message will auto-resolve in 5 Minutes.')
                                      .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
                                      .setAuthor('UNSC', 'attachment://UNSC.png')
                                      .setThumbnail('attachment://Manticore.png'),
        ]})

        //This deletes the webhook and the temporary gallery
        await webhook.delete()
        .then(tempGallery.delete())

        //Adds a back reaction to Info
        await embedMessage.react('🔙')

        //This is the filter that determines the emojis and the original member
        const filter = (reaction, user) => {
            return ['🔙'].includes(reaction.emoji.name) && user.id === player.id;
        };
        
        //This waits for a reaction by using the emoji and user from the filter
        //  It will send an error after 5 minutes and auto-resolve 
        await embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                //If the user reacts, send them back to infoNPP
                if ((reaction.emoji.name === '🔙')) {
                    embedMessage.delete()
                    .then(info.run(bot, '', player, channel));
            }})

            //If the user times out, send them back to infoNPP
            .catch(collected => {
                embedMessage.delete()
                .then(info.run(bot, '', player, channel));
            });

    } 
    //Catch any erorrs that happen during the process
    catch (error) {
        console.error('Error trying to send: ', error);
    }
}

module.exports.config = {
    name: "gallery"
}