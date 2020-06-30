const Discord = require('discord.js');
const config = require('../config.json');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports.run = async (bot, message, args) => {
    
    var channelOrigin = message.channel;
    //channelOrigin is the channel of the original Message

    //Create a webhook, that puts four images into one message and sends it
/*    const hooks = await channelOrigin.createWebhook('Virgil', './attachments/Virgil.png')
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
*/
    try {
        channelOrigin.createWebhook('Virgil');
        const webhooks = await channelOrigin.fetchWebhooks();
        const webhook = await webhooks.first();

        console.log("\nCreating temporary Webhook: " + webhook.name + " @ " + channelOrigin.name);


        let sent = await message.channel.send(new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('111th Manticore Company')
                .setDescription('Accessing Gallery Now . . .')
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