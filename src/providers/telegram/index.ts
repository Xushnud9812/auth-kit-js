/**
 * Auth-Kit-JS: Telegram Provider
 * 
 * Re-exports all Telegram authentication functionality
 */

// Types
export * from './types.js';

// WebApp verification
export {
    parseWebAppInitData,
    verifyWebAppInitData,
    verifyTelegramWebApp,
    normalizeTelegramUser,
} from './webapp.js';

// Login Widget verification
export {
    parseLoginWidgetData,
    verifyLoginWidgetData,
    verifyTelegramLoginWidget,
    normalizeTelegramLoginWidget,
} from './widget.js';
