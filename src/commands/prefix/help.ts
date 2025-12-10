import { Message } from 'discord.js';

export const helpCommand = {
    name: 'help',
    description: 'Responds with bot info',
    execute: async (message: Message) => {
        await message.reply('Pong! 🏓');
    },
};
