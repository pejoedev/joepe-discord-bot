"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloCommand = void 0;
const discord_js_1 = require("discord.js");
exports.helloCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('hello')
        .setDescription('Responds with a greeting'),
    execute: async (interaction) => {
        await interaction.reply(`Hello ${interaction.user.username}! 👋`);
    },
};
//# sourceMappingURL=hello.js.map