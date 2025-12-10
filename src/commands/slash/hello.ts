import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const helloCommand = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Responds with a greeting'),

    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply(`Hello ${interaction.user.username}! 👋`);
    },
};
