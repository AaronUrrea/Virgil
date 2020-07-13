const Discord = require('discord.js');
const config = require('../config.json');

//These are the possible files they can choose to execute
const communities = require('./communitiesNPP.js')

module.exports.run = async (bot, message, args, player, channel, role) => {

    
    if(args === 'marine'){ 
        role = args;
        player.setNickname("[RCT] " + player.user.username.toString().substring(0, 25))
        .catch(error => {
            console.log("Name too long, skipping...") }) } 
    else if(args === 'civilian') role = args


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
            { name: ('Feel free to choose the communities you would like to subscribe to!\n'),
                    value: 'When you are complete, click [✔️] to advance to the rules.\n'+
                    'To remove a role, simply press the same button again!\n'+
                    '[🔵] for Halo.\n[🔴] for Antistasi.\n[🟠] for Zombies.\n[🟣] for Stellaris.\n[🟤] for 7 Days to Die.\n '+
                    '\nThis message will auto-resolve after 1 minute of inactivity.'})
    
    //This is the variable we are going to send to the channel
    // Because this function loops, args at any given time is going to be 
    // "Civilian, Marine, Loop", so if it's a loop, then that means
    // We should not send the message again.
    var communitiesMessage;

    //If args is loop, then we know the message exists
    //  Thus, we assign communitiesMessage to the message we previously sent ourselves
    if (args === 'loop'){
        communitiesMessage = message;
    }

    //If args isn't loop, then we know the message doesn't exist
    //  So, we have to send the message and at reactions to it
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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
        }
        
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
            
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
        }

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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
        }

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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
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
            .then(communities.run(bot, communitiesMessage, "loop", player, channel, role))
        }

        //Finished with adding roles
        if(latestReaction.emoji.name === '✔️') {
            //If the user decided to not join Manticore
            if(role === 'marine'){
                player.roles.add(player.guild.roles.cache.get("725094694173933599")); //Add Squad
                player.roles.add(player.guild.roles.cache.get("725196526653014018")); //Add Awaiting Placement

                //Here we try to add the Prefix [RCT] to the user name
                //  I set the name to be cut off after 25 characters, as to fit the [RCT] in
                bot.channels.cache.get("725412224440598598").send(
                `**All hands on deck**, <@&${"725409624236490784"}>, we have a new Recruit awaiting placement! <@${player.id}>`)


                 //Deletes the message, and then remove the Visitor role
                communitiesMessage.delete()
                .then(player.roles.remove(player.guild.roles.cache.get("717530067844202566"))) //Remove Visitor
                .then(console.log("Mission accomplished, they're on their way."))
            }

            //If the user decided to be a civilian
            else if(role === 'civilian'){
                player.roles.add(player.guild.roles.cache.get("725098084949950519")); //Add Civilian

                //Deletes the message, and then remove the Visitor role
                communitiesMessage.delete()
                .then(player.roles.remove(player.guild.roles.cache.get("717530067844202566"))) //Remove Visitor
                .then(console.log("Mission accomplished, they're on their way."))
            }

            if(role === 'marine' && !player.roles.cache.some(role => role.name === 'Halo')){
                player.roles.add(communitiesMessage.guild.roles.cache.find(role => role.name === "Halo")).catch(console.error)
            }
        }
    })
    .catch(collected => {

        //Deletes the message, and then remove the Visitor role
        communitiesMessage.delete()
        .then(player.roles.remove(player.guild.roles.cache.get("717530067844202566"))) //Remove Visitor
        .then(console.log("Mission accomplished, they're on their way."))
    });
}

module.exports.config = {
    name: "communities"
}