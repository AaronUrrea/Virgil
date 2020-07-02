const Discord = require('discord.js');
const config = require('../config.json');
//const rules = require('./rules.js')

module.exports.run = async (bot, message, args, player, channel) => {
    
    try{
        await message.delete();
    }
    catch(error){
        console.log("Message delete failure.")
    } 
    
    let communitiesEmbed = new Discord.MessageEmbed()
    .setColor('#ff9900')
    .setTitle('111th Manticore Company')
    .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
    .setAuthor('UNSC', 'attachment://UNSC.png')
    .setDescription('Besides the prominent Halo community we have here, we also have some side communities, such as Stellaris' +
    ', Arma 3 Antistasi, and Arma 3 Zombies. You can also suggest adding communities, and if there is enough support, we can' +
    ' add that game to our community!')
    .setThumbnail('attachment://Manticore.png')
	.addFields(
        { name: '\u200B', value: '\u200B' },
        { name: ((player.nickname == null ? player.user.username : player.nickname) + 
                ', feel free to choose the communities you would like to subscribe to!\n'),
                value: 'When you are complete, click [✔️] to advance to the rules.\n'+
                'To remove a role, simply press the same button again!\n'+
                '[🔵] for Halo.\n[🔴] for Antistasi.\n[🟠] for Zombies.\n[🟣] for Stellaris.\n '+
                '\nThis message will auto-resolve in 5 Minutes.'})

    communitiesMessage = await channel.send(communitiesEmbed)

    await communitiesMessage.react('🔵')
        .then(communitiesMessage.react('🔴'))
        .then(communitiesMessage.react('🟠'))
        .then(communitiesMessage.react('🟣'))
        .then(communitiesMessage.react('✔️'))

    const filter =  (reaction, user) => {
        return ['🔵', '🔴', '🟠', '🟣', '✔️'].includes(reaction.emoji.name) && user.id === player.id; 
    };

    await communitiesMessage.awaitReactions(filter, {time: 300000})
    .then(collected => {
        const reaction = collected.first();

        console.log("We got here")

        //Putting the roles down as variables
        var halo = member.guild.roles.cache.find(role => role.name === "Halo")
        .catch(error => console.error('Failed to find Halo: ', error));

        var antistasi = member.guild.roles.cache.find(role => role.name === "Antistasi")
        .catch(error => console.error('Failed to find Antistasi: ', error));

        var zombies = member.guild.roles.cache.find(role => role.name === "Zombies")
        .catch(error => console.error('Failed to remove Zombies: ', error));

        var stellaris = member.guild.roles.cache.find(role => role.name === "Stellaris")
        .catch(error => console.error('Failed to remove Stellaris: ', error));
        
        //Applying the variables as roles
        //Using a switch here might be more efficient, but since it's only four roles, that's
        //Only 8 checks I have to do

        console.log("We got there")

        //Halo
        if (reaction.emoji.name === '🔵') {
            console.log("Player have Halo? " + (player.roles.cache.some(role => role.name === 'Halo')))

            console.log("User reacted. Giving Halo Role")
            .then(player.roles.cache.add(halo))
            .then(communitiesMessage.reactions.cache.get('🔵').remove())
            .then(communitiesMessage.react('🔵'))
            .catch(error => console.error('Failed to remove Halo reactions: ', error));
        }
        else if(reaction.emoji.name === '🔵' && player.roles.cache.some(role => role.name === 'Halo')) {
            console.log("User reacted. Removing Halo Role")
            .then(player.roles.cache.remove(halo))
            .then(communitiesMessage.reactions.cache.get('🔵').remove())
            .then(communitiesMessage.react('🔵'))
            .catch(error => console.error('Failed to remove Halo reactions: ', error));
        }

        ////Antistasi
        //if(reaction.emoji.name === '🔴') {
        //    console.log("User reacted. Giving Antistasi Role")
//
        //}
        //if (reaction.emoji.name === '🔵' && !player.roles.cache.some(role => role.name === 'Halo')) {
        //    console.log("User reacted. Giving Halo Role")
        //    message.reactions.cache.get('🔵').remove().catch(error => console.error('Failed to remove reactions: ', error));
        //}
        //
        ////Zombies
        //if (reaction.emoji.name === '🔵' && !player.roles.cache.some(role => role.name === 'Halo')) {
        //    console.log("User reacted. Giving Halo Role")
        //    message.reactions.cache.get('🔵').remove().catch(error => console.error('Failed to remove reactions: ', error));
        //}
        //if(reaction.emoji.name === '🟠') {
        //    console.log("User reacted. Giving Zombies Role")
//
        //}
//
        ////Stellaris
        //if (reaction.emoji.name === '🔵' && !player.roles.cache.some(role => role.name === 'Halo')) {
        //    console.log("User reacted. Giving Halo Role")
        //    message.reactions.cache.get('🔵').remove().catch(error => console.error('Failed to remove reactions: ', error));
        //}
        //if(reaction.emoji.name === '🟣') {
        //    console.log("User reacted. Giving Stellaris Role")
//
        //}
//
        ////When they are finished
        if(reaction.emoji.name === '✔️') {
            communitiesMessage.delete()
            .then(console.log("User reacted. Directing to rules\n"))

        }
    })
    .catch(collected => {
        communitiesMessage.delete()
        .then(console.log("User did not react. Interpreting abcense as complete. Directing to Rules\n"))
    });
}

module.exports.config = {
    name: "communities"
}