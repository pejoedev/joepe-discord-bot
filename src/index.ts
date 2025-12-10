import { Client, GatewayIntentBits, REST, Routes, Collection, Message, BaseInteraction, ChatInputCommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { Command } from './types/Command';
import { pingCommand } from './commands/prefix/ping';
import { helloCommand } from './commands/slash/hello';
import { multiChannelSetupCommand } from './commands/prefix/multiChannelSetup';
import { commandParser } from './helper/commandParser';
import { helpCommand } from './commands/prefix/help';
import { syncCommand } from './commands/prefix/sync';

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

    // Register slash commands
    if (clientId) {
        const rest = new REST().setToken(token);

        try {
            const commandsData = [
                helloCommand.data.toJSON(),
            ];

            console.log(`Registering ${commandsData.length} slash command(s)...`);

            await rest.put(Routes.applicationCommands(clientId), { body: commandsData });
            console.log('✅ Slash commands registered');
        } catch (error) {
            console.error('Failed to register slash commands:', error);
        }
    }
});

// Handle slash commands
client.on('interactionCreate', async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hello') {
        await helloCommand.execute(interaction);
    }
});

// Handle prefix commands
client.on('messageCreate', async (message: Message) => {
    const messageText = commandParser(message.content)
    console.log(message, messageText)
    if (message.author.bot || messageText == "") return;

    if (messageText === 'ping') {
        await pingCommand.execute(message);
    }
    if (messageText === 'help') {
        await helpCommand.execute(message);
    }
    if (messageText.startsWith("setup-mc")) {
        await multiChannelSetupCommand.execute(message);
    }
    if (messageText === 'sync') {
        await syncCommand.execute(message);
    }
});

client.login(token);
