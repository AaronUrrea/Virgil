//Integrating the Discord Javascript and Initializing the client 
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', async () =>{
    console.log("This client is online \n");
    
    client.user.setPresence({
        game: {
            name: 'with depression',
            type: "STREAMING",
            url: ""
        }
    });
    //client.user.setActivity(`Quiet's mom`)
    //client.channels.cache.get('727237273023676436').send('Fuck you too Dryer.');

});

//When the client turns on:
// send to log


const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

//Browses through commands and iniializes all avaliable
fs.readdir('./commands', (err, files) =>{
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        return console.log("[LOGS] Couldn't find commands!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);
    })
});



// Create an event listener for new guild members
client.on('guildMemberAdd', async (member) => {
    console.log('User ' + member.user.username + ' has joined the server!');

    member.roles.add(member.guild.roles.cache.get("717530067844202566")); //Add Visitor
    member.roles.add(member.guild.roles.cache.get("725106540700368947")); //Add Attributes
    member.roles.add(member.guild.roles.cache.get("725094695881015407")); //Add Communities

    let welcomeEmbed = new Discord.MessageEmbed()
    .setColor('#ff9900')
    .setTitle('111th Manticore Company')
    .attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
    .setAuthor('UNSC', 'attachment://UNSC.png')
    .setDescription('Welcome ' + member.user.username + ' to the 111th Manticore Company! We are a Gaming Community,' + 
                    ' focused primarily on Arma 3 within the Halo universe. Besides our main Arma 3 server, we offer a community' +
                    ' for other games, such as Arma 3 Antisasi/Zombies and Stellaris! We hope you enjoy your stay within our community!')
	.addFields(
        { name: '\u200B', value: '\u200B'},
        { name: ('Before you can gain access to our other channels, are you here for our Halo Community?\n'),  
                value : '[✔️] "Yes, I am here for Halo!\n[✖] "No, I am just here to browse."'})
    .setThumbnail('attachment://Manticore.png')

    let welcomeMessage = await member.guild.channels.cache.find(c => c.name === "space-port").send(welcomeEmbed);

    //This reacts an X to the embeded message   
    await welcomeMessage.react('✖')
        .then(welcomeMessage.react('✔️'))
        .then(console.log("Exit reaction assigned."))

    //This is the filter that determines the emojis and the original member
    const filter = (reaction, user) => {
        return ['✖', '✔️'].includes(reaction.emoji.name) && user.id === member.id;
    };
    
    //This waits for a reaction by using the emoji and user from the filter
    //It will send an error after 60 seconds and auto
    await welcomeMessage.awaitReactions(filter, { max: 1, errors: ['time'] })
    .then(collected => {
    const reaction = collected.first();

    if (reaction.emoji.name === '✖') {
        console.log("User is not here for Halo :(")

        let commandFile = client.commands.get('confirmation'); 
        commandFile.run(client, '', 'index', member, welcomeMessage.channel)

        welcomeMessage.delete();
    }
    else if(reaction.emoji.name === '✔️') { 
        console.log("User is here for Halo :). Redirecting to event")
        let commandFile = client.commands.get('info'); 
        commandFile.run(client, '', 'index', member, welcomeMessage.channel)

        welcomeMessage.delete();
    }})
});

client.on('message', message =>{

    // Make sure bots can't run this command
    if (message.author.bot) return;

    // Make sure the command can only be ran in a server
    if (!message.guild) return;
        
    // We don't want the bot to do anything further if it can't send messages in the channel
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
    
    //While I'm testing the bot, if they don't have Admin priveleges, they can't send commands
    //if(!message.member.permissions.toArray().includes("ADMINISTRATOR")) return;

    console.log("[" + 
                (message.member.nickname == null ? message.member.user.username : message.member.nickname)  
                +" @ " + message.channel.name + "]: " + message.toString());

    //lets say message.content = "?add halo please"
    let prefix = config.PREFIX; //Copies prefix to a local variable
    let messageArray = message.content.split(" "); //Makes an array splitting up first space in sentence, e.g ["!add", "halo please"]
    let cmd = messageArray[0].toLowerCase(); //Gets the first comamnd 
    let args = messageArray.splice(1); //Makes an array without the first index
    
    //console.log("test: " + messageArray.toString()[0])

    //Boolean as to whether the command exists
    let commandFile = client.commands.get(cmd.slice(prefix.length)); 

    //If the first letter isnt prefix, returns
    if(cmd.charAt(0) != prefix) return

    //If it has prefix, but isn't a vilid command
    else if((cmd.charAt(0) === prefix) && (!commandFile)){
        console.log("\n! INVALID COMMAND USED ! : " + cmd + "\n")
        message.reply("that is an invalid command. Would you like to try again?")
    }

    //If the first letter of the first word is prefix, and the following word is a valid command
    else if((cmd.charAt(0) === prefix) && (commandFile)){
        console.log("\n! VALID COMMAND DETECTED ! : " + cmd +"\n")
        commandFile.run(client, message, args, (message.member), (message.channel));
    }
});

//Logs the client in
client.login(config.TOKEN);