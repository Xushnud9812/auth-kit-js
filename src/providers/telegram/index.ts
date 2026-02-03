/**
 * Auth-Kit-JS: Telegram Provider
 * 
 * Telegram OAuth authentication via oauth.telegram.org
 */

// Types
export * from './types.js';

// OAuth (oauth.telegram.org)
export {
    buildTelegramOAuthUrl,
    parseTelegramOAuthCallback,
    extractBotId,
    normalizeOAuthProfile,
    type TelegramOAuthConfig,
    type TelegramOAuthCallbackData,
} from './oauth.js';
