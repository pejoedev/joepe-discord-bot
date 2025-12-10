const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('selectchannel')
    .setDescription('Select a channel (Admin only)')
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to select')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

async function execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    await interaction.reply({
        content: `You selected the channel: ${channel}`,
        ephemeral: true,
    });
}

module.exports = { data, execute };
