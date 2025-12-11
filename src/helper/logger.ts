import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');
const TODAY_LOG = path.join(LOGS_DIR, 'today.log');
const YESTERDAY_LOG = path.join(LOGS_DIR, 'yesterday.log');

let lastCheckedDate: string | null = null;

/**
 * Ensures the logs directory exists
 */
function ensureLogsDirectory(): void {
    if (!fs.existsSync(LOGS_DIR)) {
        fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
}

/**
 * Gets the current date as a string (YYYY-MM-DD format)
 */
function getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * Gets the date from the first line of today.log if it exists
 */
function getLogFileDate(): string | null {
    if (!fs.existsSync(TODAY_LOG)) {
        return null;
    }

    try {
        const content = fs.readFileSync(TODAY_LOG, 'utf-8');
        const firstLine = content.split('\n')[0];
        if (firstLine) {
            const logEntry = JSON.parse(firstLine);
            if (logEntry.timestamp) {
                return logEntry.timestamp.split('T')[0];
            }
        }
    } catch (error) {
        // If we can't read the date, return null
        return null;
    }

    return null;
}

/**
 * Rotates the log files if it's a new day
 * Renames today.log to yesterday.log (overwriting) and creates a new today.log
 */
function rotateLogsIfNeeded(): void {
    ensureLogsDirectory();

    const currentDate = getCurrentDate();

    // If we haven't checked yet today, perform rotation check
    if (lastCheckedDate !== currentDate) {
        // Check if today.log exists and if it's from a different day
        const logFileDate = getLogFileDate();

        if (fs.existsSync(TODAY_LOG) && logFileDate && logFileDate !== currentDate) {
            // Log file is from a previous day, rotate it
            // Remove yesterday.log if it exists
            if (fs.existsSync(YESTERDAY_LOG)) {
                fs.unlinkSync(YESTERDAY_LOG);
            }
            // Rename today.log to yesterday.log
            fs.renameSync(TODAY_LOG, YESTERDAY_LOG);
        }

        // Update the last checked date
        lastCheckedDate = currentDate;
    }
}

/**
 * Logs data to today.log file
 * @param data - The data to log (will be JSON stringified)
 */
export function logToFile(data: any, prefab: string): void {
    rotateLogsIfNeeded();

    // Custom replacer to handle BigInt serialization
    const logEntry = JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ) + '\n';

    fs.appendFileSync(TODAY_LOG, prefab + " " + logEntry, 'utf-8');
}/**
 * Logs message data to the log file
 * @param message - Discord message object
 */
export function logMessage(message: any): void {
    const logData = {
        type: 'message',
        timestamp: new Date().toISOString(),
        messageId: message.id,
        createdTimestamp: message.createdTimestamp,
        messageType: message.type,
        system: message.system,
        content: message.content,
        channelId: message.channelId,
        guildId: message.guildId,
        author: {
            id: message.author?.id,
            bot: message.author?.bot,
            system: message.author?.system,
            username: message.author?.username,
            globalName: message.author?.globalName,
            discriminator: message.author?.discriminator,
            avatar: message.author?.avatar,
            banner: message.author?.banner,
            accentColor: message.author?.accentColor,
            avatarDecoration: message.author?.avatarDecoration,
            avatarDecorationData: message.author?.avatarDecorationData,
            collectibles: message.author?.collectibles,
            primaryGuild: message.author?.primaryGuild,
        },
        pinned: message.pinned,
        tts: message.tts,
        nonce: message.nonce,
        embeds: message.embeds,
        components: message.components,
        attachments: message.attachments ? Array.from(message.attachments.values()) : [],
        stickers: message.stickers ? Array.from(message.stickers.values()) : [],
        position: message.position,
        roleSubscriptionData: message.roleSubscriptionData,
        resolved: message.resolved,
        editedTimestamp: message.editedTimestamp,
        mentions: {
            everyone: message.mentions?.everyone,
            users: message.mentions?.users ? Array.from(message.mentions.users.values()) : [],
            roles: message.mentions?.roles ? Array.from(message.mentions.roles.values()) : [],
            channels: message.mentions?._channels ? Array.from(message.mentions._channels.values()) : [],
            crosspostedChannels: message.mentions?.crosspostedChannels ? Array.from(message.mentions.crosspostedChannels.values()) : [],
            repliedUser: message.mentions?.repliedUser,
        },
        webhookId: message.webhookId,
        groupActivityApplication: message.groupActivityApplication,
        applicationId: message.applicationId,
        activity: message.activity,
        flags: message.flags?.bitfield,
        reference: message.reference,
        interactionMetadata: message.interactionMetadata,
        interaction: message.interaction,
        poll: message.poll,
        messageSnapshots: message.messageSnapshots ? Array.from(message.messageSnapshots.values()) : [],
        call: message.call,
    };

    logToFile(logData, `message | G${message.guildId} | <#${message.channelId}> |`);
}

/**
 * Logs slash command interaction data to the log file
 * @param interaction - Discord interaction object
 */
export function logSlashCommand(interaction: any): void {
    const logData = {
        type: 'slashCommand',
        timestamp: new Date().toISOString(),
        interactionId: interaction.id,
        interactionType: interaction.type,
        commandName: interaction.commandName,
        commandType: interaction.commandType,
        commandId: interaction.commandId,
        commandGuildId: interaction.commandGuildId,
        channelId: interaction.channelId,
        guildId: interaction.guildId,
        user: {
            id: interaction.user?.id,
            bot: interaction.user?.bot,
            system: interaction.user?.system,
            username: interaction.user?.username,
            globalName: interaction.user?.globalName,
            discriminator: interaction.user?.discriminator,
            avatar: interaction.user?.avatar,
            banner: interaction.user?.banner,
            accentColor: interaction.user?.accentColor,
            avatarDecoration: interaction.user?.avatarDecoration,
            avatarDecorationData: interaction.user?.avatarDecorationData,
            collectibles: interaction.user?.collectibles,
            primaryGuild: interaction.user?.primaryGuild,
        },
        member: interaction.member ? {
            userId: interaction.member.user?.id,
            nickname: interaction.member.nickname,
            roles: interaction.member.roles?.cache ? Array.from(interaction.member.roles.cache.keys()) : [],
            joinedTimestamp: interaction.member.joinedTimestamp,
            premiumSinceTimestamp: interaction.member.premiumSinceTimestamp,
            permissions: interaction.member.permissions?.bitfield,
        } : null,
        options: interaction.options?.data,
        createdTimestamp: interaction.createdTimestamp,
        token: interaction.token ? '[REDACTED]' : null,
        version: interaction.version,
        appPermissions: interaction.appPermissions?.bitfield,
        memberPermissions: interaction.memberPermissions?.bitfield,
        locale: interaction.locale,
        guildLocale: interaction.guildLocale,
        entitlements: interaction.entitlements ? Array.from(interaction.entitlements.values()) : [],
        authorizingIntegrationOwners: interaction.authorizingIntegrationOwners,
        context: interaction.context,
    };

    logToFile(logData, `slashCommand | G${interaction.guildId} | <#${interaction.channelId}> |`);
}
