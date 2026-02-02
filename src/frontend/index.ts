/**
 * Auth-Kit-JS: Frontend Module
 * 
 * Browser-only helpers for authentication
 */

// Button helpers
export {
    getAuthButtons,
    getAuthButton,
    createButtonHelper,
} from './buttons.js';

// OAuth helpers
export {
    startOAuth,
    startOAuthPopup,
    retrieveOAuthState,
    validateState,
    type StartOAuthOptions,
} from './oauth.js';

// Telegram WebApp helpers
export {
    isTelegramWebApp,
    getTelegramWebApp,
    getTelegramInitData,
    getTelegramUser,
    getTelegramTheme,
    initTelegramWebApp,
    expandTelegramWebApp,
    closeTelegramWebApp,
    verifyTelegramWithBackend,
} from './telegram.js';
