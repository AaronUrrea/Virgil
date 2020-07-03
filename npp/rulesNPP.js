const Discord = require('discord.js');
const config = require('../config.json');

//These are the possible files they can choose to execute
const communities = require('./communitiesNPP.js')

module.exports.run = async (bot, args, player, channel) => {
    
    //Creates rulesEmbed to be sent
    let rulesEmbed = new Discord.MessageEmbed()
        .setColor('#ff9900')
        .setTitle('111th Manticore Company')
        .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setDescription('Before you are ready to jump in, you need to read the ground rules of the server.')
        .setThumbnail('attachment://Manticore.png')
        .addFields(
            { name: 'Discord Rules', value: '1. Be respectful of others. Know when to stop with table talk.\n' +
                                            '2. No harassment of any kind.\n' +
                                            '3. Post things in their proper channels. (memes in memes and etc.)\n' +
                                            '4. Do not spam for attention.\n' +
                                            '5. Understand the Chain of Command and properly utilize it if you have questions.\n' +
                                            '6. Must have working mic to partake in Ops.\n' +
                                            '7. Must be 15-16+ years old(determined case by case)\n' +
                                            '8. No recruiting for other units. Unless your unit is already affiliated.'},

            //(player.roles.cache.some(role => role.name === 'Halo') ? 
            { name: 'Halo Rules', value: '1. Have fun.\n' +
                                         '2. No blue on blue.\n' +
                                         '3. Stick to your proper equipment loadouts.\n' +
                                         '4. Listen to supervisors.\n' +
                                         '5. Do not abuse your authority. Know the difference between authority and power.\n' +
                                         '6. Do not ram civilians or other vehicles.\n' +
                                         '7. Be respectful and professional. \n' +
                                         '8. Stick to your assigned vehicles.\n' +
                                         '9. Utilize the COC. ' }, //: { name: '\u200B', value : '\u200B'} ),

            //(player.roles.cache.some(role => role.name === 'Antistasi') ? 
            { name: 'Antistasi Rules', value: '1. Do not kill civs.\n' +
                                              '2. Do not go off on your own and piss off the enemy factions.\n' +
                                              '3. Do not waste gear.\n' +
                                              '4. No blue on blue.\n' +
                                              '5. Do not destroy civilian infrastructure if it can be helped.' }, //: { name: '\u200B', value : '\u200B'} ),

            //(player.roles.cache.some(role => role.name === 'Zombies') ? 
            { name: 'Zombies Rules', value: '1. Have fun.\n' +
                                            '2. Do not make the game unplayable.(Do not fuck everything up for everyone else.)\n' +
                                            '3. No Blue on Blue.\n' +
                                            '4. Listen to the Zeus ' }, //: { name: '\u200B', value : '\u200B'} ),   

            { name: ('After 1 minute, you may advance by clicking [🔜].'),  
                    value : '\nThis message will auto-resolve after 5 minutes of inactivity.' })

    //Send rulesEmbed, initialize new promise as rulesMessage
    const rulesMessage = await channel.send(rulesEmbed);

    //Creates a new timeout, waits for 60 seconds and then adds reaction to rulesMessage
    setTimeout( () => {
        rulesMessage.react('🔜')
        .then(console.log("Finish reaction created"));
    }, 5000);

    //This is the filter that determines the emojis and the original member
    const filter = (reaction, user) => {
        return ['🔜'].includes(reaction.emoji.name) && user.id === player.id;
    }

    //This waits for a reaction by using the emoji and user from the filter
    //  It will send an error after 5 minutes and auto-resolve
    await rulesMessage.awaitReactions(filter, { max: 1, time: 360000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();

        //If the player accepts, redirects to communities
        if(reaction.emoji.name === '🔜'){
            rulesMessage.delete()
            .then(communities.run(bot, '', args, player, channel))
        }
    })
    .catch(collected => {

        //If the player times out, redirects to communities
        rulesMessage.delete()
        .then(communities.run(bot, '', args, player, channel))
    });
    

}

module.exports.config = {
    name: "rules"
}