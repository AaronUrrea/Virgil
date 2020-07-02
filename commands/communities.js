const Discord = require('discord.js');
const config = require('../config.json');
const communities = require('./communities.js')
const rules = require('./rules.js')

module.exports.run = async (bot, message, args, player, channel) => {
  
    

    if(args != 'loop'){
        try{
            await message.delete();
        }
        catch(error){
            console.log("Message delete failure.")
        } 
    }

    if(args === 'info'){
        player.roles.add(player.guild.roles.cache.get("725094694173933599")); //Add Squad
        player.roles.add(player.guild.roles.cache.get("725196526653014018")); //Add Awaiting Placement


        var name = player.user.username;
        player.setNickname("[RCT] " + name)
        .catch(error => {
            console.log("Name too long, skipping...") })
    

    }
    else if(args === 'conf'){
        player.roles.add(player.guild.roles.cache.get("725098084949950519")); //Add Civilian
    }

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
                    '[🔵] for Halo.\n[🔴] for Antistasi.\n[🟠] for Zombies.\n[🟣] for Stellaris.\n '+
                    '\nThis message will auto-resolve after 1 minute of inactivity.'})
    
                
    var communitiesMessage;


    if(args != 'loop' || args === 'info'){
        communitiesMessage = await channel.send(communitiesEmbed)

        await communitiesMessage.react('🔵')
        .then(communitiesMessage.react('🔴'))
        .then(communitiesMessage.react('🟠'))
        .then(communitiesMessage.react('🟣'))
        .then(communitiesMessage.react('✔️'))

    }

    else if (args === 'loop'){
        console.log("We got at loop")
        communitiesMessage = message;
    }

    const filter =  (reaction, user) => {
        return ['🔵', '🔴', '🟠', '🟣', '✔️'].includes(reaction.emoji.name) && user.id === player.id; 
    };
    
    const halo = communitiesMessage.guild.roles.cache.find(role => role.name === "Halo")

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
            .then(console.log("Halo added to user, Restarting loop"))
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
            .then(console.log("Halo removed from user, Restarting loop"))
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
            .then(console.log("Antistasi added to user, Restarting loop"))
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
            .then(console.log("Antistasi removed from user, Restarting loop"))
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
            .then(console.log("Zombies added to user, Restarting loop"))
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
            .then(console.log("Zombies removed from user, Restarting loop"))
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
            .then(console.log("Stellaris added to user, Restarting loop"))
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
            .then(console.log("Stellaris removed from user, Restarting loop"))
            .then(communities.run(bot, communitiesMessage, "loop", player, channel))
        }
        //

        if(latestReaction.emoji.name === '✔️') {
            //If the user clicked out without picking a community, adds halo by default
            if((!player.roles.cache.some(role => role.name === 'Halo') && (!player.roles.cache.some(role => role.name === 'Antistasi')) 
               && (!player.roles.cache.some(role => role.name === 'Zombies')) && !player.roles.cache.some(role => role.name === 'Stellaris')))
            {
                player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "Halo"))
                .then(console.log("No roles added. Adding default 'Halo' role.\n"))
            }

            //if(args === 'conf' || args === 'info'){
                communitiesMessage.delete()
                .then(console.log("Roles assigned. Redirecting to rules"))
                .then(rules.run(bot, message, 'com', player, channel))
            //}

            //else{
            //    communitiesMessage.delete()
            //    .then(console.log("Roles assigned. Exiting windows"))
            //}
        }
    })
    .catch(collected => {
        //If the user timed out without picking a community, adds halo by default
        if((!player.roles.cache.some(role => role.name === 'Halo') && (!player.roles.cache.some(role => role.name === 'Antistasi')) 
        && (!player.roles.cache.some(role => role.name === 'Zombies')) && !player.roles.cache.some(role => role.name === 'Stellaris')))
        {
            player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "Halo"))
            .then(console.log("No roles added. Adding default 'Halo' role.\n"))
        }

        communitiesMessage.delete()
        .then(console.log("Roles assigned. Redirecting to rules"))
        .then(rules.run(bot, message, 'com', player, channel))
    });
}

module.exports.config = {
    name: "communities"
}