const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Sync all slash commands (Owner only)'),
    async execute(interaction) {
        // Check if user is the bot owner
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({
                content: 'Only the bot owner can use this command!',
                ephemeral: true,
            });
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            // Sync commands globally
            const synced = await interaction.client.application.commands.set(
                interaction.client.commands.map(cmd => ({
                    name: cmd.data.name,
                    description: cmd.data.description,
                    options: cmd.data.options || [],
                }))
            );

            await interaction.editReply({
                content: `✅ Successfully synced ${synced.size} command(s) globally!`,
            });
        } catch (error) {
            console.error('Error syncing commands:', error);
            await interaction.editReply({
                content: '❌ Failed to sync commands. Check the console for errors.',
            });
        }
    },
};
