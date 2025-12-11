import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { slashCommands, prefixCommands } from '../../commandRegistry';

// Configure page length (number of commands per page)
const COMMANDS_PER_PAGE = 6;

export const helpCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Explains the commands to you.'),

    execute: async (interaction: ChatInputCommandInteraction) => {
        // Combine all commands with type indicator
        const allCommands = [
            ...slashCommands.map(cmd => ({
                name: `/${cmd.data.name}`,
                description: cmd.data.description,
                type: 'slash'
            })),
            ...prefixCommands.map(cmd => ({
                name: cmd.name,
                description: cmd.description,
                type: 'prefix'
            }))
        ];

        const totalPages = Math.ceil(allCommands.length / COMMANDS_PER_PAGE);
        let currentPage = 0;

        const generateEmbed = (page: number) => {
            const start = page * COMMANDS_PER_PAGE;
            const end = start + COMMANDS_PER_PAGE;
            const pageCommands = allCommands.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📖 Bot Help')
                .setDescription('Here are all the available commands:')
                .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
                .setTimestamp();

            // Group commands by type for display
            const slashCmds = pageCommands.filter(cmd => cmd.type === 'slash');
            const prefixCmds = pageCommands.filter(cmd => cmd.type === 'prefix');

            if (slashCmds.length > 0) {
                const slashCommandsText = slashCmds
                    .map(cmd => `\`${cmd.name}\` - ${cmd.description}`)
                    .join('\n');
                embed.addFields({
                    name: '⚡ Slash Commands',
                    value: slashCommandsText,
                    inline: false,
                });
            }

            if (prefixCmds.length > 0) {
                const prefixCommandsText = prefixCmds
                    .map(cmd => `\`${cmd.name}\` - ${cmd.description}`)
                    .join('\n');
                embed.addFields({
                    name: '💬 Prefix Commands',
                    value: prefixCommandsText,
                    inline: false,
                });
            }

            return embed;
        };

        const generateButtons = (page: number) => {
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('<<')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('>>')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages - 1)
                );
            return row;
        };

        const response = await interaction.reply({
            embeds: [generateEmbed(currentPage)],
            components: [generateButtons(currentPage)],
            fetchReply: true
        });

        // Create collector for button interactions
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000 // 5 minutes
        });

        collector.on('collect', async (buttonInteraction) => {
            // Only allow the original user to use the buttons
            if (buttonInteraction.user.id !== interaction.user.id) {
                await buttonInteraction.reply({
                    content: 'These buttons are not for you!',
                    ephemeral: true
                });
                return;
            }

            if (buttonInteraction.customId === 'prev') {
                currentPage = Math.max(0, currentPage - 1);
            } else if (buttonInteraction.customId === 'next') {
                currentPage = Math.min(totalPages - 1, currentPage + 1);
            }

            await buttonInteraction.update({
                embeds: [generateEmbed(currentPage)],
                components: [generateButtons(currentPage)]
            });
        });

        collector.on('end', async () => {
            // Disable buttons when collector expires
            try {
                await interaction.editReply({
                    embeds: [generateEmbed(currentPage)],
                    components: []
                });
            } catch (error) {
                // Ignore errors if message was deleted
            }
        });
    },
};
