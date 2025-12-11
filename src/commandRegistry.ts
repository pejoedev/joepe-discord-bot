import { helloCommand } from './commands/slash/hello';
import { syncSlashCommand } from './commands/slash/sync';
import { helpCommand } from './commands/slash/help';
import { multiChannelSetupCommand } from './commands/slash/multiChannelSetup';
import { pingCommand } from './commands/prefix/ping';
import { syncCommand } from './commands/prefix/sync';

// Global registry for all slash commands
export const slashCommands = [
    helloCommand,
    syncSlashCommand,
    helpCommand,
    multiChannelSetupCommand,
];

// Global registry for all prefix commands
export const prefixCommands = [
    pingCommand,
    syncCommand,
];
