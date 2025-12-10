import { Message } from 'discord.js';

export const pingCommand = {
    name: 'ping',
    description: 'Responds with pong!',
    execute: async (message: Message) => {
        await message.reply('Pong! 🏓');
    },
};
