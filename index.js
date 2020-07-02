//Integrating the Discord Javascript and Initializing the client 
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Bot Initialization Process
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


client.on('ready', async () =>{
    console.log("\nThis client is online \n");
    client.user.setActivity(`on ${client.guilds.cache.size} servers`)

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Commands/New-Player-Process initialization
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fs = require("fs");
client.commands = new Discord.Collection();
client.npp = new Discord.Collection();

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

//Browses through npp and iniializes process for guildMemberAdd
fs.readdir('./npp', (err, files) =>{
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        return console.log("[LOGS] Couldn't find processes!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./npp/${f}`);
        client.npp.set(pull.config.name, pull);
    })
});

// Create an event listener for new guild members
client.on('guildMemberAdd', async (member) => {
    
    console.log("we get here. " + member.user.username)
    let commandFile = client.npp.get('intro'); 
    commandFile.run(client, 'index', member, client.channels.cache.get("728031364468834374"));
    
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Message/Comamnds Handler
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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