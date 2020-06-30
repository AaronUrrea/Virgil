const Discord = require('discord.js');
const config = require('../config.json');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports.run = async (bot, message, args) => {
    
    var channelOrigin = message.channel;

    try {
        await channelOrigin.createWebhook('Virgil', {
            avatar: './attachments/Virgil.png'
        })

        const webhooks = await channelOrigin.fetchWebhooks();
        //console.log(webhooks)
        const webhook = await webhooks.first();
        //console.log(webhook)

        console.log("\nCreating temporary Webhook: " + webhook.name + " @ " + channelOrigin.name);

        let sent = await message.channel.send(new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Permission granted, ' + message.member.nickname + '.\nAccessing Gallery Now . . .')
                .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
                .setAuthor('UNSC', 'attachment://UNSC.png')
                .setThumbnail('attachment://Manticore.png'))
        .then(console.log("Accessing Gallery."))

        await message.delete()
        .then(console.log("Original command deleted."));

        await webhook.send({embeds: [
            new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Permission granted, ' + message.member.nickname + '.\nAccessing Gallery Now . . .')
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
        ]})
        .then(console.log("Gallery sent."))

        await webhook.delete()
        .then(sent.delete())
        .then(console.log("Temporary webhook deleted.\nAll Done :)\n"))

    } catch (error) {
        console.error('Error trying to send: ', error);
    }
}

module.exports.config = {
    name: "gallery"
}