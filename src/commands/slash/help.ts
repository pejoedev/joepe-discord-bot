import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { slashCommands, prefixCommands } from '../../commandRegistry';

export const helpCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Explains the commands to you.'),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('📖 Bot Help')
            .setDescription('Here are all the available commands:')
            .setTimestamp();

        // Add slash commands
        if (slashCommands.length > 0) {
            const slashCommandsText = slashCommands
                .map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`)
                .join('\n');
            embed.addFields({
                name: '⚡ Slash Commands',
                value: slashCommandsText,
                inline: false,
            });
        }

        // Add prefix commands
        if (prefixCommands.length > 0) {
            const prefixCommandsText = prefixCommands
                .map(cmd => `\`${cmd.name}\` - ${cmd.description}`)
                .join('\n');
            embed.addFields({
                name: '💬 Prefix Commands',
                value: prefixCommandsText,
                inline: false,
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
