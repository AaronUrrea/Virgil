//Integrating the Discord Javascript and Initializing the client 
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');


client.on('ready', async () =>{
    console.log("This client is online \n");
    
    client.user.setActivity(`on ${client.guilds.cache.size} servers`)
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
client.on('guildMemberAdd', (member) => {
    console.log('User ' + member.user.username + ' has joined the server!');
    member.roles.add(member.guild.roles.cache.find(role => role.name === 'Recruit'));
    member.roles.add(member.guild.roles.cache.get("725106540700368947")); //Add Attributes
    member.roles.add(member.guild.roles.cache.get("725094695881015407")); //Add Communities

    //Squad - 725094694173933599
    //Callsign - 725094695247675402
    //Attributes - 725106540700368947
    //Communities - 725094695881015407

    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    member.guild.channels.cache.find(c => c.name === "new-player-chat").send(`"${member.user.username}" has joined this server`);
});

client.on('message', message =>{
    // Make sure bots can't run this command
    if (message.author.bot) return;

    // Make sure the command can only be ran in a server
    if (!message.guild) return;
        
    // We don't want the bot to do anything further if it can't send messages in the channel
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
    
    console.log("[" + message.member.nickname +" @ " + message.channel.name + "]: " + message.toString());

    //lets say message.content = "?add halo please"
    let prefix = config.PREFIX; //Copies prefix to a local variable
    let messageArray = message.content.split(" "); //Makes an array splitting up first space in sentence, e.g ["!add", "halo please"]
    let cmd = messageArray[0].toLowerCase(); //Gets the first comamnd 
    let args = messageArray.slice(1); //Makes an array without the first index

    let commandFile = client.commands.get(cmd.slice(prefix.length)); 

    if(commandFile){
        console.log("! VALID COMMAND DETECTED ! : " + cmd)
        commandFile.run(client, message, args);
    }
});

//Logs the client in
client.login(config.TOKEN);