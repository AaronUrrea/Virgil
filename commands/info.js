const Discord = require('discord.js');
const config = require('../config.json');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

//


module.exports.run = async (bot, message, args) => {
    
    var channelOrigin = message.channel;

    setTimeout(() => {
        message.delete();
    }, 1000);
    
    let infoEmbed = new Discord.MessageEmbed()
    .setColor('#ff9900')
    .setTitle('111th Manticore Company')
    .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
    .setAuthor('UNSC', 'attachment://UNSC.png')
    .setDescription('We are a gaming community that primarily focuses on Halo Operations in Arma 3.' +
                    'We also do a variety of operations that cycle throughout the weeks. If your interested in being apart of' + 
                    'our fantastic community then head over to our **TeamSpeak: 185.249.196.154:9104** and hop into the **#Waiting' +
                    'For Recruiter** channel and a recruiter will be with you asap. Enjoy your stay!')
    .setThumbnail('attachment://Manticore.png')
	.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: '**SCHEDULE:**', value: '\u200B'},
		{ name: 'Monday', value: 'Free', inline: true },
        { name: 'Tuesday', value: 'Free', inline: true },
        { name: 'Wednesday', value: 'Free', inline: true },
        { name: 'Thursday', value: 'Free', inline: true },
        { name: 'Friday', value: 'Training', inline: true },
        { name: 'Saturday', value: 'Free', inline: true },
        { name: 'Sunday', value: 'Story Operation, 7:30PM Load CST, 8:00PM Briefing/Step Off', inline: true },

	)


    //console.log("Wait 5");
    //setTimeout(() => { console.log("Done")}, 5000)

    channelOrigin.send(infoEmbed);
    

}

module.exports.config = {
    name: "info"
}