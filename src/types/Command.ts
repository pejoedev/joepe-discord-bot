import { Message, ChatInputCommandInteraction } from 'discord.js';

export interface Command {
    name: string;
    description: string;
    execute: (arg: Message | ChatInputCommandInteraction) => Promise<void>;
}
