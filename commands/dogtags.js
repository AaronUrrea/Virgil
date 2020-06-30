const Discord = require('discord.js');
const config = require('../config.json');

//


module.exports.run = async (bot, message, args) => {
    let messageArray = message.content.split(" ")[1];
    console.log("Test" + messageArray);
    
}

module.exports.config = {
    name: "dogtags"
}