"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const ping_1 = require("./commands/prefix/ping");
const hello_1 = require("./commands/slash/hello");
dotenv_1.default.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
if (!token) {
    throw new Error('DISCORD_TOKEN is not set in .env file');
}
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
// Store slash commands
const slashCommands = new discord_js_1.Collection();
client.once('ready', async () => {
    console.log(`✅ Bot logged in as ${client.user?.tag}`);
    // Register slash commands
    if (clientId) {
        const rest = new discord_js_1.REST().setToken(token);
        try {
            const commandsData = [
                hello_1.helloCommand.data.toJSON(),
            ];
            console.log(`Registering ${commandsData.length} slash command(s)...`);
            await rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commandsData });
            console.log('✅ Slash commands registered');
        }
        catch (error) {
            console.error('Failed to register slash commands:', error);
        }
    }
});
// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === 'hello') {
        await hello_1.helloCommand.execute(interaction);
    }
});
// Handle prefix commands
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!'))
        return;
    if (message.content === '!ping') {
        await ping_1.pingCommand.execute(message);
    }
});
client.login(token);
//# sourceMappingURL=index.js.map