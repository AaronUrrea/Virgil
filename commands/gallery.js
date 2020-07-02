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
        //console.log(webhooks)
        const webhook = await webhooks.first();
        //console.log(webhook)

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
        .then(console.log("Accessing Gallery."))

        //This deletes the original command message
        try{
            await message.delete()
            .then(console.log("Original command deleted."));
        }
        catch(error){
            console.log("Message not found. Skipping.")
        }

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
        .then(console.log("Gallery sent."))

        //This deletes the webhook and the temporary gallery
        await webhook.delete()
        .then(tempGallery.delete())
        .then(console.log("Temporary webhook deleted."))

        //If args is info, add a back reaction, else, just assign exit
        if(args === 'info'){
            await embedMessage.react('🔙')
            .then(console.log("Redirect reaction assigned."))
        }

        else{
            await embedMessage.react('✖')
            .then(console.log("Exit reaction assigned."))
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
                    .then(console.log("User reacted. Deleting message.\n"))}

                if ((reaction.emoji.name === '🔙') && (args === 'info')) {
                    embedMessage.delete()
                    .then(console.log("User reacted. Returning to Info\n"))    
                    .then(info.run(bot, message, 'gallery', player, channel));
            }})
            .catch(collected => {
                embedMessage.delete()
                .then(console.log("User did not react. Deleting message.\n"))
            });

    } catch (error) {
        console.error('Error trying to send: ', error);
    }
}

module.exports.config = {
    name: "gallery"
}