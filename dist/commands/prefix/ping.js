"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingCommand = void 0;
exports.pingCommand = {
    name: 'ping',
    description: 'Responds with pong!',
    execute: async (message) => {
        await message.reply('Pong! 🏓');
    },
};
//# sourceMappingURL=ping.js.map