import { SlashCommandBuilder, ChatInputCommandInteraction, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const ownerId = process.env.OWNER_ID;

export const syncSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Sync Slash Commands (Owner only)'),

    execute: async (interaction: ChatInputCommandInteraction) => {
        // Check if user is the owner
        if (interaction.user.id !== ownerId) {
            await interaction.reply({ content: '❌ Only the bot owner can use this command.', ephemeral: true });
            return;
        }

        const token = process.env.DISCORD_TOKEN;
        const clientId = process.env.CLIENT_ID;

        if (!token || !clientId) {
            await interaction.reply({ content: '❌ Missing DISCORD_TOKEN or CLIENT_ID in .env file.', ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const rest = new REST().setToken(token);

            // Import all slash commands here
            const { helloCommand } = await import('../slash/hello');

            const commandsData = [
                helloCommand.data.toJSON(),
                syncSlashCommand.data.toJSON()
                // Add more slash commands here as you create them
            ];

            // Sync globally
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandsData }
            );

            await interaction.editReply(`✅ Successfully synced ${commandsData.length} slash command(s) globally.\nDo \`Ctrl+R\` to view them.`);
            console.log(`✅ Synced ${commandsData.length} slash commands`);
        } catch (error) {
            console.error('Failed to sync slash commands:', error);
            await interaction.editReply('❌ Failed to sync slash commands. Check console for details.');
        }
    },
};
