/**
 * Auth-Kit-JS: Frontend Telegram OAuth Helper
 * 
 * Browser-side helpers for Telegram OAuth authentication
 */

/**
 * Configuration for Telegram OAuth
 */
export interface TelegramOAuthOptions {
    /** Bot ID (numeric part of bot token, e.g., '5323903014') */
    botId: string;
    /** Your callback URL */
    redirectUri: string;
    /** Open in popup instead of redirect */
    popup?: boolean;
    /** Popup width (default: 550) */
    popupWidth?: number;
    /** Popup height (default: 470) */
    popupHeight?: number;
}

/**
 * Telegram OAuth result
 */
export interface TelegramOAuthResult {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

/**
 * Start Telegram OAuth flow
 * 
 * @example
 * ```typescript
 * // Redirect mode
 * startTelegramOAuth({
 *   botId: '5323903014',
 *   redirectUri: 'https://yoursite.com/auth/telegram/callback'
 * });
 * 
 * // Popup mode
 * const result = await startTelegramOAuth({
 *   botId: '5323903014',
 *   redirectUri: 'https://yoursite.com/auth/telegram/callback',
 *   popup: true
 * });
 * ```
 */
export function startTelegramOAuth(options: TelegramOAuthOptions): Promise<TelegramOAuthResult> | void {
    const authUrl = buildTelegramAuthUrl(options.botId, options.redirectUri);

    if (options.popup) {
        return openTelegramOAuthPopup(authUrl, options);
    } else {
        window.location.href = authUrl;
    }
}

/**
 * Build Telegram OAuth URL
 */
function buildTelegramAuthUrl(botId: string, redirectUri: string): string {
    const params = new URLSearchParams({
        bot_id: botId,
        origin: redirectUri,
        request_access: 'write',
    });
    return `https://oauth.telegram.org/auth?${params.toString()}`;
}

/**
 * Open Telegram OAuth in popup window
 */
function openTelegramOAuthPopup(
    authUrl: string,
    options: TelegramOAuthOptions
): Promise<TelegramOAuthResult> {
    return new Promise((resolve, reject) => {
        const width = options.popupWidth || 550;
        const height = options.popupHeight || 470;
        const left = Math.round((window.innerWidth - width) / 2);
        const top = Math.round((window.innerHeight - height) / 2);

        const popup = window.open(
            authUrl,
            'telegram_oauth',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (!popup) {
            reject(new Error('Failed to open popup. Check if popups are blocked.'));
            return;
        }

        // Listen for message from popup
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://oauth.telegram.org') {
                return;
            }

            window.removeEventListener('message', handleMessage);
            popup.close();

            if (event.data?.error) {
                reject(new Error(event.data.error));
            } else if (event.data?.user) {
                resolve(event.data.user as TelegramOAuthResult);
            }
        };

        window.addEventListener('message', handleMessage);

        // Check if popup was closed
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                window.removeEventListener('message', handleMessage);
                reject(new Error('Popup was closed'));
            }
        }, 500);
    });
}

/**
 * Handle Telegram OAuth callback
 * Call this on your callback page to extract auth data from URL
 * 
 * @example
 * ```typescript
 * const authData = handleTelegramOAuthCallback();
 * if (authData) {
 *   fetch('/api/auth/telegram', {
 *     method: 'POST',
 *     body: JSON.stringify(authData)
 *   });
 * }
 * ```
 */
export function handleTelegramOAuthCallback(): TelegramOAuthResult | null {
    const hash = window.location.hash;

    if (!hash) {
        return null;
    }

    try {
        const fragment = hash.startsWith('#') ? hash.substring(1) : hash;
        const params = new URLSearchParams(fragment);
        const tgAuthResult = params.get('tgAuthResult');

        if (!tgAuthResult) {
            return null;
        }

        const decoded = atob(tgAuthResult);
        return JSON.parse(decoded) as TelegramOAuthResult;
    } catch {
        return null;
    }
}
