/**
 * Auth-Kit-JS: Telegram Types
 * 
 * Type definitions for Telegram OAuth authentication
 */

/**
 * Telegram user data from OAuth
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
    /** URL to user's profile photo */
    photo_url?: string;
}
