const Discord = require("discord.js")
const config = require("./config.json")

const client = new Discord.Client({ 
  intents: [ 
Discord.GatewayIntentBits.Guilds
    
       ]
    });

module.exports = client


client.slashCommands = new Discord.Collection()


require('./handler')(client)

client.login(config.token)
