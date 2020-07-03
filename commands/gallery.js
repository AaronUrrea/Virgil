const Discord = require('discord.js');
const config = require('../config.json');
const info = require('./info.js')
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports.run = async (bot, message, args, player, channel) => {
    
    try {
        await channel.createWebhook('Virgil', {
            avatar: './attachments/Virgil.png'
        })

        const webhooks = await channel.fetchWebhooks();
        const webhook = await webhooks.first();

        console.log("Creating temporary Webhook: " + webhook.name + " @ " + channel.name);

        //This is a temporary gallery message that appears while the actual gallery loads
        let tempGallery = await channel.send(new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Permission granted, ' + 
                    (player.nickname == null ? player.user.username : player.nickname) +
                    '.\nAccessing Gallery Now . . .')
                .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
                .setAuthor('UNSC', 'attachment://UNSC.png')
                .setThumbnail('attachment://Manticore.png'))
        
        //This is the full embeded message with all of the images in the gallery
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
                                                     (args === 'info' ? ', Click [🔙] to return to info.' : ', Click [✖] to exit.') +
                                                     '\nThis message will auto-delete in 5 Minutes.')
                                      .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
                                      .setAuthor('UNSC', 'attachment://UNSC.png')
                                      .setThumbnail('attachment://Manticore.png'),
        ]})

        //This deletes the webhook and the temporary gallery
        await tempGallery.delete()
        .then(console.log("Deleting temporary Webhook: " + webhook.name + " @ " + channel.name+"\n"))
        .then(webhook.delete())


        //If args is info, add a back reaction, else, just assign exit
        if(args === 'info'){
            await embedMessage.react('🔙')
        }

        else{
            await embedMessage.react('✖')
        }
    
        //This is the filter that determines the emojis and the original member
        const filter = (reaction, user) => {
            if(args === 'info')
                return ['🔙'].includes(reaction.emoji.name) && user.id === player.id;
            else{
                return ['✖'].includes(reaction.emoji.name) && user.id === player.id;
            }
        };
        
        //This waits for a reaction by using the emoji and user from the filter
        //It will send an error after 60 seconds and auto
        await embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();
            if (reaction.emoji.name === '✖') {
                embedMessage.delete()
            }
            else if ((reaction.emoji.name === '🔙') && (args === 'info')) {
                embedMessage.delete()
                .then(info.run(bot, '', 'gallery', player, channel));
        }})
        .catch(collected => {
            if(args === 'info'){
                embedMessage.delete()
                .then(info.run(bot, '', 'gallery', player, channel))
            }
            else{
                embedMessage.delete()
            }
        })
    

    } catch (error) {
        console.error('Error trying to send: ', error);
    }
}

module.exports.config = {
    name: "gallery"
}