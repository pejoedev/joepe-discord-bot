# joepe-discord-bot

Joepe is a multipurpose Discord bot built with discord.js and TypeScript.

## Features

- **Slash Commands**: Modern Discord slash commands
- **Prefix Commands**: Traditional `!` prefix commands
- **Works in all servers**: Bot operates across all guilds it's invited to
- **TypeScript**: Full type safety and modern development experience

## Commands

### Slash Commands
- `/hello` - Responds with a greeting

### Prefix Commands
- `!ping` - Responds with "Pong!"

## Prerequisites

- Node.js 16.9.0 or higher
- npm or yarn
- A Discord bot token (from [Discord Developer Portal](https://discord.com/developers/applications))

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
```

You can copy from `.env.example` and fill in your values:
```bash
cp .env.example .env
```

### 3. Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### 4. Run

Start the bot:
```bash
npm start
```

Or for development with hot reload:
```bash
npm run dev
```

Watch mode for development:
```bash
npm run watch
```

## Getting Bot Token and Client ID

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" tab and create a bot
4. Copy the token and set it as `DISCORD_TOKEN` in `.env`
5. Go to "General Information" tab and copy the Application ID, set it as `CLIENT_ID` in `.env`
6. Invite the bot to your server with the following permissions:
   - Send Messages
   - Read Message History
   - Use Slash Commands

## Project Structure

```
src/
├── index.ts              # Main bot file
├── commands/
│   ├── prefix/          # Prefix commands (like !ping)
│   │   └── ping.ts
│   └── slash/           # Slash commands (like /hello)
│       └── hello.ts
└── types/
    └── Command.ts       # Command type definitions
```

## License

MIT
