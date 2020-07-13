const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async(bot, message, args, player, channel) => {

    if(args[0] === '' || args[0] === ' ' || args[0] === 'help' || args[0] === undefined ){

        let suggestionHelp = await message.channel.send(new Discord.MessageEmbed()
        .setColor('#ff9900')
        .setTitle('111th Manticore Company')
        .setDescription(`<@${player.id}>` + ', to use ?suggestion:')
        .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setThumbnail('attachment://Manticore.png')
        .addFields(
            { name: 'All you have to do is type in any sentence after ?suggestion', value: 'Example: "?suggestion Eating donuts everyday.' },
            { name: "\u200B", value: 'Click [✖] to exit.' +
            '\nThis message will auto-delete in 1 minute.'}))

        suggestionHelp.react('✖');

        const filter = (reaction, user) => {
            return ['✖'].includes(reaction.emoji.name) && user.id === player.id;
        }

        await suggestionHelp.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();

            if(reaction.emoji.name === '✖'){
                suggestionHelp.delete()
            }
        })
        .catch(collected => {
            suggestionHelp.delete()
        });
    }

    else{

        var suggest = ''

        for(i = 0; i < args.length; i++){
            suggest+=(args[i].toString() + " ");
        }

        let suggestion = await message.channel.send(new Discord.MessageEmbed()
        .setColor('#ff9900')
        .setTitle('111th Manticore Company')
        .setDescription(`<@${player.id}>` + ', are you sure you want to suggest this?')
        .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setThumbnail('attachment://Manticore.png')
        .addFields(
            { name: '"' + suggest + '"', value: '\u200B' },
            { name: "\u200B", value: 'Click [✔️] to accept.' +
            '\nClick [✖] to exit.' +
            '\nThis message will auto-delete in 1 minute.'}))

            suggestion.react('✔️')
            .then(suggestion.react('✖'))

        const filter = (reaction, user) => {
            return ['✔️', '✖'].includes(reaction.emoji.name) && user.id === player.id;
        }

        await suggestion.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(async collected => {
            const reaction = collected.first();

            if(reaction.emoji.name === '✔️'){
                let result = await bot.channels.cache.get("728505413682856038").send(new Discord.MessageEmbed()
                    .setColor('#ff9900')
                    .setTitle('111th Manticore Company')
                    .setDescription(`<@${player.id}>` + ' suggests:')
                    .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
                    .setAuthor('UNSC', 'attachment://UNSC.png')
                    .setThumbnail('attachment://Manticore.png') 
                    .addFields(
                        { name: '"' + suggest + '"', value: '\u200B' } ))
                await result.react('✅')
                await result.react('❌')
                
                await suggestion.delete()
            
            }

            else if(reaction.emoji.name === '✖'){
                suggestion.delete()
            }
        })
        .catch(collected => {
            suggestion.delete()
        });

    }









}

module.exports.config = {
    name: 'suggestion'
}