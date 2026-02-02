/**
 * Auth-Kit-JS: Telegram Types
 * 
 * Type definitions for Telegram authentication
 */

/**
 * Telegram user data (common between WebApp and Widget)
 */
export interface TelegramUser {
    /** Unique identifier for this user */
    id: number;
    /** User's first name */
    first_name: string;
    /** User's last name (optional) */
    last_name?: string;
    /** User's username (optional) */
    username?: string;
    /** User's language code (optional) */
    language_code?: string;
    /** True if user is premium */
    is_premium?: boolean;
    /** True if user added the bot to attachment menu */
    added_to_attachment_menu?: boolean;
    /** True if user allows writing direct messages */
    allows_write_to_pm?: boolean;
    /** URL to user's profile photo */
    photo_url?: string;
}

/**
 * Parsed Telegram WebApp init data
 */
export interface TelegramWebAppInitData {
    /** Query ID for inline mode */
    query_id?: string;
    /** User information */
    user?: TelegramUser;
    /** Receiver information (for bot inline messages) */
    receiver?: TelegramUser;
    /** Chat information */
    chat?: {
        id: number;
        type: 'group' | 'supergroup' | 'channel';
        title: string;
        username?: string;
        photo_url?: string;
    };
    /** Chat type */
    chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
    /** Chat instance */
    chat_instance?: string;
    /** Start parameter from deep link */
    start_param?: string;
    /** Can user send messages after authorization */
    can_send_after?: number;
    /** Unix timestamp of data generation */
    auth_date: number;
    /** Hash for verification */
    hash: string;
}

/**
 * Telegram Login Widget callback data
 */
export interface TelegramLoginWidgetData {
    /** Unique user identifier */
    id: number;
    /** User's first name */
    first_name: string;
    /** User's last name (optional) */
    last_name?: string;
    /** User's username (optional) */
    username?: string;
    /** User's profile photo URL (optional) */
    photo_url?: string;
    /** Unix timestamp of authorization */
    auth_date: number;
    /** Verification hash */
    hash: string;
}

/**
 * Verification options
 */
export interface TelegramVerifyOptions {
    /** Maximum age of auth_date in seconds (default: 86400 = 24h) */
    authDateTTL?: number;
    /** Skip TTL validation (not recommended) */
    skipTTLCheck?: boolean;
}
