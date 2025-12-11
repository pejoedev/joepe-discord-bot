import { Client, GatewayIntentBits, REST, Routes, Collection, Message, BaseInteraction, ChatInputCommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { Command } from './types/Command';
import { pingCommand } from './commands/prefix/ping';
import { helloCommand } from './commands/slash/hello';
import { syncSlashCommand } from './commands/slash/sync';
import { multiChannelSetupCommand } from './commands/prefix/multiChannelSetup';
import { commandParser } from './helper/commandParser';
import { helpCommand } from './commands/prefix/help';
import { syncCommand } from './commands/prefix/sync';
import { logMessage, logSlashCommand } from './helper/logger';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token) {
    throw new Error('DISCORD_TOKEN is not set in .env file');
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Store slash commands
const slashCommands = new Collection<string, any>();

client.once('clientReady', async () => {
    console.log(`✅ Bot logged in as ${client.user?.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Log the slash command
    logSlashCommand(interaction);

    if (interaction.commandName === 'hello') {
        await helloCommand.execute(interaction);
    }
    if (interaction.commandName === 'sync') {
        await syncSlashCommand.execute(interaction);
    }
});

// Handle prefix commands
client.on('messageCreate', async (message: Message) => {
    // Log the message
    logMessage(message);
    const messageText = commandParser(message.content)
    if (message.author.bot || messageText == "") return;


    if (messageText === 'ping') {
        await pingCommand.execute(message);
        return;
    }
    if (messageText === 'help') {
        await helpCommand.execute(message);
        return;
    }
    if (messageText.startsWith("setup-mc")) {
        await multiChannelSetupCommand.execute(message);
        return;
    }
    if (messageText === 'sync') {
        await syncCommand.execute(message);
        return;
    }
});

client.login(token);
