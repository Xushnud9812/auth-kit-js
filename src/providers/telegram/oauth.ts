/**
 * Auth-Kit-JS: Telegram OAuth
 * 
 * Telegram OAuth flow via oauth.telegram.org
 * This is different from Login Widget and WebApp
 * 
 * Flow:
 * 1. Redirect user to oauth.telegram.org
 * 2. User enters phone number
 * 3. Telegram sends verification code
 * 4. User is redirected back with auth data
 */

import type { TelegramUser } from './types.js';

/**
 * Telegram OAuth configuration
 */
export interface TelegramOAuthConfig {
    /** Your Telegram bot ID (numeric part before the colon in bot token) */
    botId: string;
    /** Callback URL where user will be redirected after authentication */
    redirectUri: string;
    /** OAuth scope - currently only 'write' is supported by Telegram */
    scope?: 'write';
    /** State parameter for CSRF protection */
    state?: string;
}

/**
 * Telegram OAuth callback data received after successful authentication
 */
export interface TelegramOAuthCallbackData {
    /** Unique identifier for this user */
    id: number;
    /** User's first name */
    first_name: string;
    /** User's last name (optional) */
    last_name?: string;
    /** User's username (optional) */
    username?: string;
    /** User's profile photo URL (optional) */
    photo_url?: string;
    /** Authentication timestamp */
    auth_date: number;
    /** Verification hash */
    hash: string;
}

/**
 * Build Telegram OAuth authorization URL
 * 
 * @example
 * ```typescript
 * const authUrl = buildTelegramOAuthUrl({
 *   botId: '5323903014', // Your bot ID (get from @BotFather)
 *   redirectUri: 'https://yoursite.com/auth/telegram/callback',
 *   state: 'random-state-string'
 * });
 * 
 * // Redirect user to authUrl
 * window.location.href = authUrl;
 * ```
 */
export function buildTelegramOAuthUrl(config: TelegramOAuthConfig): string {
    const params = new URLSearchParams({
        bot_id: config.botId,
        origin: config.redirectUri,
        request_access: config.scope || 'write',
    });

    if (config.state) {
        // Telegram doesn't have native state support, 
        // so we encode it in the origin URL
        const redirectUrl = new URL(config.redirectUri);
        redirectUrl.searchParams.set('state', config.state);
        params.set('origin', redirectUrl.toString());
    }

    return `https://oauth.telegram.org/auth?${params.toString()}`;
}

/**
 * Parse Telegram OAuth callback data from URL fragment
 * 
 * After successful authentication, Telegram redirects to:
 * https://yoursite.com/callback#tgAuthResult=<base64-encoded-data>
 * 
 * @example
 * ```typescript
 * // In your callback handler
 * const authData = parseTelegramOAuthCallback(window.location.hash);
 * if (authData) {
 *   // Send to backend for verification
 *   fetch('/api/auth/telegram', {
 *     method: 'POST',
 *     body: JSON.stringify(authData)
 *   });
 * }
 * ```
 */
export function parseTelegramOAuthCallback(hash: string): TelegramOAuthCallbackData | null {
    try {
        // Remove leading #
        const fragment = hash.startsWith('#') ? hash.substring(1) : hash;

        // Parse query string from fragment
        const params = new URLSearchParams(fragment);
        const tgAuthResult = params.get('tgAuthResult');

        if (!tgAuthResult) {
            return null;
        }

        // Decode base64
        const decoded = atob(tgAuthResult);
        const data = JSON.parse(decoded) as TelegramOAuthCallbackData;

        return data;
    } catch {
        return null;
    }
}

/**
 * Extract bot ID from bot token
 * 
 * @example
 * ```typescript
 * const botId = extractBotId('5323903014:AAH...');
 * // Returns: '5323903014'
 * ```
 */
export function extractBotId(botToken: string): string {
    const colonIndex = botToken.indexOf(':');
    if (colonIndex === -1) {
        throw new Error('Invalid bot token format');
    }
    return botToken.substring(0, colonIndex);
}

/**
 * Normalize Telegram OAuth user to standard profile
 */
export function normalizeOAuthProfile(data: TelegramOAuthCallbackData) {
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ');

    return {
        provider: 'telegram' as const,
        providerUserId: String(data.id),
        name: name || undefined,
        firstName: data.first_name,
        lastName: data.last_name,
        avatarUrl: data.photo_url,
        // Telegram OAuth doesn't provide email
        email: undefined,
        rawProfile: data,
    };
}
