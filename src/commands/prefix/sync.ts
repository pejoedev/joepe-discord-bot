import { Message, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const ownerId = process.env.OWNER_ID;

export const syncCommand = {
    name: 'sync',
    description: 'Sync slash commands (Owner only)',
    execute: async (message: Message) => {
        // Check if user is the owner
        if (message.author.id !== ownerId) {
            await message.reply('❌ Only the bot owner can use this command.');
            return;
        }

        const token = process.env.DISCORD_TOKEN;
        const clientId = process.env.CLIENT_ID;

        if (!token || !clientId) {
            await message.reply('❌ Missing DISCORD_TOKEN or CLIENT_ID in .env file.');
            return;
        }

        try {
            const statusMessage = await message.reply('🔄 Syncing slash commands...');

            const rest = new REST().setToken(token);

            // Import all slash commands here
            const { helloCommand } = await import('../slash/hello');

            const commandsData = [
                helloCommand.data.toJSON(),
                // Add more slash commands here as you create them
            ];

            // Sync globally
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandsData }
            );

            await statusMessage.edit(`✅ Successfully synced ${commandsData.length} slash command(s) globally.`);
            console.log(`✅ Synced ${commandsData.length} slash commands`);
        } catch (error) {
            console.error('Failed to sync slash commands:', error);
            await message.reply('❌ Failed to sync slash commands. Check console for details.');
        }
    },
};
