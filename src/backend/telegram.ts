/**
 * Auth-Kit-JS: Backend Telegram OAuth Handler
 * 
 * Server-side Telegram OAuth verification
 */

import { createHmac } from 'crypto';
import type { NormalizedProfile, TelegramConfig } from '../core/types.js';
import { TelegramVerificationError } from '../core/errors.js';

/**
 * Telegram OAuth callback data
 */
export interface TelegramOAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

/**
 * Verify Telegram OAuth data
 * 
 * @param data - OAuth callback data from client
 * @param botToken - Your Telegram bot token
 * @param options - Verification options
 * @returns Normalized user profile
 */
export async function verifyTelegramOAuth(
    data: TelegramOAuthData,
    botToken: string,
    options: { authDateTTL?: number } = {}
): Promise<NormalizedProfile> {
    const { hash, ...userData } = data;

    // Check auth_date TTL
    const authDateTTL = options.authDateTTL ?? 86400; // 24 hours default
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime - data.auth_date > authDateTTL) {
        throw new TelegramVerificationError('expired');
    }

    // Build data check string (sorted alphabetically)
    const dataCheckArr: string[] = [];
    const sortedKeys = Object.keys(userData).sort();

    for (const key of sortedKeys) {
        const value = userData[key as keyof typeof userData];
        if (value !== undefined) {
            dataCheckArr.push(`${key}=${value}`);
        }
    }

    const dataCheckString = dataCheckArr.join('\n');

    // Create secret key from bot token
    const secretKey = createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

    // Calculate expected hash
    const expectedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Verify hash
    if (hash !== expectedHash) {
        throw new TelegramVerificationError('invalid_hash');
    }

    // Return normalized profile
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ');

    return {
        provider: 'telegram',
        providerUserId: String(data.id),
        name: name || undefined,
        avatarUrl: data.photo_url,
        email: undefined, // Telegram doesn't provide email
        raw: data,
    };
}

/**
 * Create Telegram OAuth handler with pre-configured options
 * 
 * @param config - Telegram configuration
 * @returns Verification function
 */
export function createTelegramHandler(config: TelegramConfig) {
    return {
        /**
         * Verify Telegram OAuth data
         * 
         * @param data - OAuth callback data
         * @returns Normalized user profile
         */
        async verify(data: TelegramOAuthData): Promise<NormalizedProfile> {
            return verifyTelegramOAuth(data, config.botToken, {
                authDateTTL: config.authDateTTL,
            });
        },
    };
}
