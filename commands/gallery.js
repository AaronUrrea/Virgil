const Discord = require('discord.js');
const config = require('../config.json');
const info = require('./info.js')
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports.run = async (bot, message, args) => {
    
 
    var channelOrigin = message.channel;
    var memberOrigin = message.member;

    //console.log(memberOrigin)

    try {
        await channelOrigin.createWebhook('Virgil', {
            avatar: './attachments/Virgil.png'
        })

        const webhooks = await channelOrigin.fetchWebhooks();
        //console.log(webhooks)
        const webhook = await webhooks.first();
        //console.log(webhook)

        console.log("Creating temporary Webhook: " + webhook.name + " @ " + channelOrigin.name);

        //This is a temporary gallery message that appears while the actual gallery loads
        let tempGallery = await message.channel.send(new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Permission granted, ' + 
                    (message.member.nickname == null ? message.member.user.username : message.member.nickname) +
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
                    (message.member.nickname == null ? message.member.user.username : message.member.nickname) +
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
                                      .setDescription((message.member.nickname == null ? message.member.user.username : message.member.nickname) + 
                                                     ', please click [✖] to exit' +
                                                     (args === 'info' ? ', or click [🔙] to return to info.' : '.') +
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

        //This reacts an X to the embeded message
        if(args === 'info'){
            await embedMessage.react('✖')
            .then(embedMessage.react('🔙'))
            .then(console.log("Exit and redirect reaction assigned."))
        }

        else{
            await embedMessage.react('✖')
            .then(console.log("Exit reaction assigned."))
        }
    
        //This is the filter that determines the emojis and the original member
        const filter = (reaction, user) => {
            if(args === 'info')
                return ['✖', '🔙'].includes(reaction.emoji.name) && user.id === memberOrigin.id;
            else{
                return ['✖'].includes(reaction.emoji.name) && user.id === memberOrigin.id;
            }
        };
        
        //This waits for a reaction by using the emoji and user from the filter
        //It will send an error after 60 seconds and auto
        await embedMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
        
                if (reaction.emoji.name === '✖') {
                    embedMessage.delete()
                    .then(console.log("User reacted. Deleting message."))}

                if ((reaction.emoji.name === '🔙') && (args === 'info')) {
                    embedMessage.delete()
                    .then(console.log("User reacted. Returning to Info"))    
                    .then(info.run(bot, message, ''));
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