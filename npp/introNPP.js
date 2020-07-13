const Discord = require('discord.js');
const config = require('../config.json');

//These are the possible files they can choose to execute
const confirmation = require('./confirmationNPP.js')
const info = require('./infoNPP.js')

module.exports.run = async(bot, args, player, channel) => {

    console.log('User ' + player.user.username + ' has joined the server!');

    //Add default roles to new player
    player.roles.add(player.guild.roles.cache.get("717530067844202566")); //Add Visitor
    player.roles.add(player.guild.roles.cache.get("725106540700368947")); //Add Attributes
    player.roles.add(player.guild.roles.cache.get("725094695881015407")); //Add Communities

    //Create welcome embed to be sent
    let welcomeEmbed = new Discord.MessageEmbed()
        .setColor('#ff9900')
        .setTitle('111th Manticore Company')
        .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setDescription('Welcome ' + `<@${player.id}>` + ' to the 111th Manticore Company! We are a Gaming Community,' + 
                        ' focused primarily on Arma 3 within the Halo universe. Besides our main Arma 3 server, we offer a community' +
                        ' for other games, such as Arma 3 Antisasi/Zombies and Stellaris! We hope you enjoy your stay within our community!')
	    .addFields(
            { name: '\u200B', value: '\u200B'},
            { name: ('Before you can gain access to our other channels, are you here for our Halo Community?\n'),  
                    value : '[✔️] "Yes, I am here for Halo!\n[✖] "No, I am just here to browse."'})
        .setThumbnail('attachment://Manticore.png')

    //Send welcomeEmbed, initialize new promise as welcomeMessage
    let welcomeMessage = await player.guild.channels.cache.find(c => c.name === "space-port").send(welcomeEmbed);

    //Reacts two reactions to the embeded message   
    await welcomeMessage.react('✖')
        .then(welcomeMessage.react('✔️'))

    //This is the filter that determines the emojis and the original member
    const filter = (reaction, user) => {
        return ['✖', '✔️'].includes(reaction.emoji.name) && user.id === player.id;
    };
    
    //This waits for a reaction by using the emoji and user from the filter
    await welcomeMessage.awaitReactions(filter, { max: 1 })
    .then(collected => {
        const reaction = collected.first();

        //If they refuse, direct them to the confirmation window
        if (reaction.emoji.name === '✖') {
            welcomeMessage.delete()
            .then(confirmation.run(bot, '', player, channel))

        }
        //If they accept, direct them to the info window
        else if(reaction.emoji.name === '✔️') { 
            welcomeMessage.delete()
            .then(info.run(bot, '', player, channel))

    }})
}

module.exports.config = {
    name: 'intro'
}