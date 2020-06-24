// requirements
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

// discord message if statements
client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'bait') {
        const baitUser = message.mentions.users.first();
        message.channel.send(`${baitUser.username} tried to bait someone and failed.`);
    }
    else if (command === 'caught') {
        const mentionedUsers = message.mentions.users.array();
        const baitUser = mentionedUsers[0];
        const caughtUser = mentionedUsers[1];
        message.channel.send(`${baitUser.username} caught ${caughtUser.username} on their bait!`);
    }
});

client.login(token);
