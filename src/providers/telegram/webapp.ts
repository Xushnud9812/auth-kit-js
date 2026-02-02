/**
 * Auth-Kit-JS: Telegram WebApp Verification
 * 
 * Secure verification of Telegram WebApp initData
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */

import { hmacSha256, sha256, timingSafeEqual } from '../../core/crypto.js';
import { TelegramVerificationError } from '../../core/errors.js';
import { createNormalizedProfile, isExpired } from '../../core/utils.js';
import type { NormalizedProfile } from '../../core/types.js';
import type { TelegramWebAppInitData, TelegramVerifyOptions } from './types.js';

/** Default TTL for auth_date: 24 hours */
const DEFAULT_AUTH_DATE_TTL = 86400;

/**
 * Parse Telegram WebApp initData string
 * 
 * @param initData - The raw initData string from Telegram WebApp
 * @returns Parsed init data object
 */
export function parseWebAppInitData(initData: string): TelegramWebAppInitData {
    const params = new URLSearchParams(initData);
    const result: Record<string, unknown> = {};

    for (const [key, value] of params.entries()) {
        // Parse JSON fields
        if (key === 'user' || key === 'receiver' || key === 'chat') {
            try {
                result[key] = JSON.parse(value);
            } catch {
                result[key] = value;
            }
        } else if (key === 'auth_date' || key === 'can_send_after') {
            result[key] = parseInt(value, 10);
        } else {
            result[key] = value;
        }
    }

    // Validate required fields
    if (typeof result.auth_date !== 'number' || isNaN(result.auth_date)) {
        throw new TelegramVerificationError('missing_data', 'Missing or invalid auth_date');
    }

    if (typeof result.hash !== 'string' || !result.hash) {
        throw new TelegramVerificationError('missing_data', 'Missing hash');
    }

    return result as unknown as TelegramWebAppInitData;
}

/**
 * Build the data-check-string for verification
 * All fields sorted alphabetically, excluding 'hash'
 * 
 * @param initData - The raw initData string
 * @returns Data check string
 */
function buildDataCheckString(initData: string): string {
    const params = new URLSearchParams(initData);
    const entries: [string, string][] = [];

    for (const [key, value] of params.entries()) {
        if (key !== 'hash') {
            entries.push([key, value]);
        }
    }

    // Sort alphabetically by key
    entries.sort((a, b) => a[0].localeCompare(b[0]));

    // Join as key=value pairs with newlines
    return entries.map(([k, v]) => `${k}=${v}`).join('\n');
}

/**
 * Verify Telegram WebApp initData
 * 
 * Security steps:
 * 1. Compute HMAC-SHA256 of "WebAppData" with SHA256(botToken) as key
 * 2. Compute HMAC-SHA256 of data-check-string with step 1 result as key
 * 3. Compare result with provided hash using timing-safe comparison
 * 4. Validate auth_date TTL
 * 
 * @param initData - The raw initData string from Telegram WebApp
 * @param botToken - Your Telegram Bot Token
 * @param options - Verification options
 * @returns Parsed and verified init data
 */
export async function verifyWebAppInitData(
    initData: string,
    botToken: string,
    options: TelegramVerifyOptions = {}
): Promise<TelegramWebAppInitData> {
    const { authDateTTL = DEFAULT_AUTH_DATE_TTL, skipTTLCheck = false } = options;

    // Parse init data
    const parsed = parseWebAppInitData(initData);

    // Check TTL
    if (!skipTTLCheck && isExpired(parsed.auth_date, authDateTTL)) {
        throw new TelegramVerificationError(
            'expired',
            `Authentication expired. auth_date is older than ${authDateTTL} seconds.`
        );
    }

    // Build data check string
    const dataCheckString = buildDataCheckString(initData);

    // Step 1: Create secret key = HMAC_SHA256(botToken, "WebAppData")
    const secretKey = await sha256(botToken);

    // Step 2: Compute hash = HMAC_SHA256(secretKey, dataCheckString)
    const computedHash = await hmacSha256(secretKey, dataCheckString);

    // Step 3: Compare with provided hash (timing-safe)
    if (!timingSafeEqual(computedHash, parsed.hash)) {
        throw new TelegramVerificationError('invalid_hash');
    }

    return parsed;
}

/**
 * Verify WebApp initData and return normalized profile
 * 
 * @param initData - The raw initData string from Telegram WebApp
 * @param botToken - Your Telegram Bot Token
 * @param options - Verification options
 * @returns Normalized user profile
 */
export async function verifyTelegramWebApp(
    initData: string,
    botToken: string,
    options: TelegramVerifyOptions = {}
): Promise<NormalizedProfile> {
    const verified = await verifyWebAppInitData(initData, botToken, options);

    if (!verified.user) {
        throw new TelegramVerificationError('missing_data', 'No user data in initData');
    }

    return normalizeTelegramUser(verified.user, verified);
}

/**
 * Normalize Telegram user to standard profile
 */
export function normalizeTelegramUser(
    user: TelegramWebAppInitData['user'],
    raw: unknown
): NormalizedProfile {
    if (!user) {
        throw new TelegramVerificationError('missing_data', 'User data is missing');
    }

    const name = [user.first_name, user.last_name].filter(Boolean).join(' ');

    return createNormalizedProfile('telegram', String(user.id), {
        name: name || undefined,
        avatarUrl: user.photo_url,
        // Telegram doesn't provide email
        email: undefined,
        raw,
    });
}
