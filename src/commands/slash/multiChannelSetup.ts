import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const multiChannelSetupCommand = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup multi channel'),

    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply(`Hello ${interaction.user.username}! 👋`);
    },
};
