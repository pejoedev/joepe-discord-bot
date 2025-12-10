const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('clientReady', () => {
    console.log(`✓ Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('Pong!');
    }

    if (message.content === '!hello') {
        message.reply(`Hello ${message.author}!`);
    }
});

client.login(process.env.DISCORD_TOKEN);
