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
    client.user.setActivity(`?help for commands.`)

});

//Send a message to any channel on start up
//client.channels.cache.get("728382898574458920").send(new Discord.MessageEmbed()
//.setColor('#ff9900')
//.setTitle('111th Manticore Company')
//.setDescription('Use this channel to command me do complete actions.\nTo get started, type "?help"')
//.attachFiles(['./attachments/UNSC.png', './attachments/Manticore.png'])
//.setAuthor('UNSC', 'attachment://UNSC.png')
//.setThumbnail('attachment://Manticore.png'))






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// New-Player-Process initialization
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
    
    client.channels.cache.get('728413318804406333').send(new Discord.MessageEmbed()
        .setColor('#228B22')
        .setTitle(member.user.username + ` has just docked!`)
        .attachFiles(['./attachments/UNSC.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setThumbnail(member.user.avatarURL()))

    let commandFile = client.npp.get('intro'); 
    commandFile.run(client, 'index', member, client.channels.cache.get("728031364468834374"));
    
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Player leaving
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on('guildMemberRemove', async (member) => {
    
    client.channels.cache.get('728413318804406333').send(new Discord.MessageEmbed()
        .setColor('#8B0000')
        .setTitle(member.user.username + ` has disembarked!`)
        .attachFiles(['./attachments/UNSC.png'])
        .setAuthor('UNSC', 'attachment://UNSC.png')
        .setThumbnail(member.user.avatarURL()))
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Message/Commands Handler
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

    //If the first letter isnt prefix, and its not in #requests
    if(cmd.charAt(0) != prefix && message.channel.id != "728382898574458920") return

    //If it's not in #requests, but does have the prefix
    else if(cmd.charAt(0) === prefix && message.channel.id != "728382898574458920"){
        wrongChannel(message)
        .then(message.delete())
        .catch()
    }    

    //If it is in #requests, but doesn't have a prefix
    else if(cmd.charAt(0) != prefix && message.channel.id === "728382898574458920"){
        onlyCommands(message)
        .then(message.delete())
        .catch()
    }    

    //If the command inputted is invalid
    else if(!commandFile){
        wrongCommand(message)
        .then(message.delete())
        .catch()
    }

    //If it has prefix and is valid
    else if(commandFile){
        console.log("\n! VALID COMMAND DETECTED ! : " + cmd +"\n")
        commandFile.run(client, message, args, (message.member), (message.channel));
    }        
    
});

async function wrongChannel(message) {
    let reply = await message.channel.send(`<@${message.member.id}>, this is the wrong channel for commands. Refer to *#requests*.`)
    .then(setTimeout(async () => {
        await reply.delete();
    }, 5000))
}

async function wrongCommand(message) {
    let reply = await message.channel.send(`<@${message.member.id}>, that command does not exist. Refer to *?help*.`)
    .then(setTimeout(async () => {
        await reply.delete();
    }, 5000))
}

async function onlyCommands(message) {
    let reply = await message.channel.send(`<@${message.member.id}>, only commands are allowed in this channel. Refer to *?help*.`)
    .then(setTimeout(async () => {
        await reply.delete();
    }, 5000))
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Misc Code
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Logs the client in
client.login(config.TOKEN);