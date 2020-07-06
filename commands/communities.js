const Discord = require('discord.js');
const config = require('../config.json');
const communities = require('./communities.js')
const rules = require('./rules.js')

module.exports.run = async (bot, message, args, player, channel) => {
  
    //Creates communitiesEmbed to be sent
    communitiesEmbed = new Discord.MessageEmbed()
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
                    '[🔵] for Halo.\n[🔴] for Antistasi.\n[🟠] for Zombies.\n[🟣] for Stellaris.\n[🟤] for 7 Days to Die.\n '+
                    '\nThis message will auto-resolve after 1 minute of inactivity.'})
    
    //This is the variable we are going to send to the channel
    // Because this function loops, if it's a loop, then that means
    // We should not send the message again.            
    var communitiesMessage;

    //If args is loop, then we know the message exists
    //  Thus, we assign communitiesMessage to the message we previously sent ourselves
    if(args === 'loop'){
        communitiesMessage = message;
    }

    //If args isn't loop, then we know the message doesn't exist
    //  So, we have to send the message and at reactions to itss
    else{
        communitiesMessage = await channel.send(communitiesEmbed)

        await communitiesMessage.react('🔵')
        .then(communitiesMessage.react('🔴'))
        .then(communitiesMessage.react('🟠'))
        .then(communitiesMessage.react('🟣'))
        .then(communitiesMessage.react('🟤'))
        .then(communitiesMessage.react('✔️'))
    }

    //This is the filter that determines the emojis and the original member
    const filter =  (reaction, user) => {
        return ['🔵', '🔴', '🟠', '🟣', '🟤', '✔️'].includes(reaction.emoji.name) && user.id === player.id; 
    };
    
    //This waits for a reaction by using the emoji and user from the filter
    //  It will send an error after 1 minute and auto-resolve
    //  Using a switch here might've been easier, but this is Version 1.0 after all
    await communitiesMessage.awaitReactions(filter, {max: 1, time: 60000, errors: ['time'] })
    .then(async collected => {

        const userReactions = communitiesMessage.reactions.cache.filter(reaction => reaction.users.cache.has(player.id));
        const latestReaction = collected.first();

        //Halo
        if(latestReaction.emoji.name === '🔵' && !player.roles.cache.some(role => role.name === 'Halo')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "Halo")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }

        if(latestReaction.emoji.name === '🔵' && player.roles.cache.some(role => role.name === 'Halo')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.remove(communitiesMessage.guild.roles.cache.find(role => role.name === "Halo")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }
        //
        
        //Antistasi
        if(latestReaction.emoji.name === '🔴' && !player.roles.cache.some(role => role.name === 'Antistasi')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "Antistasi")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }

        if(latestReaction.emoji.name === '🔴' && player.roles.cache.some(role => role.name === 'Antistasi')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.remove(communitiesMessage.guild.roles.cache.find(role => role.name === "Antistasi")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }
        //

        //Zombies
        if(latestReaction.emoji.name === '🟠' && !player.roles.cache.some(role => role.name === 'Zombies')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "Zombies")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }

        if(latestReaction.emoji.name === '🟠' && player.roles.cache.some(role => role.name === 'Zombies')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.remove(communitiesMessage.guild.roles.cache.find(role => role.name === "Zombies")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }
        //

        //Stellaris
        if(latestReaction.emoji.name === '🟣' && !player.roles.cache.some(role => role.name === 'Stellaris')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "Stellaris")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }

        if(latestReaction.emoji.name === '🟣' && player.roles.cache.some(role => role.name === 'Stellaris')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.remove(communitiesMessage.guild.roles.cache.find(role => role.name === "Stellaris")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }

        //7 Days to Die
        if(latestReaction.emoji.name === '🟤' && !player.roles.cache.some(role => role.name === '7 Days to Die')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "7 Days to Die")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }

        if(latestReaction.emoji.name === '🟤' && player.roles.cache.some(role => role.name === '7 Days to Die')) {
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(player.id)
                }
            } catch (error) {
                console.error('Failed to remove reactions.')
            }

            player.roles.remove(communitiesMessage.guild.roles.cache.find(role => role.name === "7 Days to Die")).catch(console.error)
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }        

        //If the user reacts to this, deletes the message
        if(latestReaction.emoji.name === '✔️') {
            communitiesMessage.delete()
        }
    })
    .catch(collected => {
        //If the user timed out, exits
        communitiesMessage.delete()
    });
}

module.exports.config = {
    name: "communities"
}