import { Client, GatewayIntentBits, REST, Routes, Collection, Message, BaseInteraction, ChatInputCommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { Command } from './types/Command';
import { slashCommands, prefixCommands } from './commandRegistry';
import { commandParser } from './helper/commandParser';
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

// Store slash commands in a Collection for quick lookup
const slashCommandsCollection = new Collection<string, any>();
slashCommands.forEach(cmd => {
    slashCommandsCollection.set(cmd.data.name, cmd);
});

client.once('clientReady', async () => {
    console.log(`✅ Bot logged in as ${client.user?.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Log the slash command
    logSlashCommand(interaction);

    const command = slashCommandsCollection.get(interaction.commandName);
    if (command) {
        await command.execute(interaction);
    }
});

// Handle prefix commands
client.on('messageCreate', async (message: Message) => {
    // Log the message
    logMessage(message);
    const messageText = commandParser(message.content)
    if (message.author.bot || messageText == "") return;

    // Find and execute the matching prefix command
    const command = prefixCommands.find(cmd => cmd.name === messageText);
    if (command) {
        await command.execute(message);
    }
});

client.login(token);
