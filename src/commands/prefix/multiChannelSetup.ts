import { Message } from 'discord.js';
import { commandParser } from '../../helper/commandParser';

export const multiChannelSetupCommand = {
    name: 'setup',
    description: 'Setup multi channel',
    execute: async (message: Message) => {

        const shortened = commandParser(message.content).trim();
        console.log(shortened)

        // Parse -channel=<#id> parameter
        const channelMatch = shortened.match(/-channel=\s*<#(\d+)>/);
        const channelId = channelMatch ? channelMatch[1] : message.channelId;
        await message.reply(`Selected: <#${channelId}>`);
    },
};
