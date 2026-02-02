/**
 * Auth-Kit-JS: Telegram Login Widget Verification
 * 
 * Secure verification of Telegram Login Widget callback data
 * https://core.telegram.org/widgets/login#checking-authorization
 */

import { hmacSha256, sha256, timingSafeEqual } from '../../core/crypto.js';
import { TelegramVerificationError } from '../../core/errors.js';
import { createNormalizedProfile, isExpired } from '../../core/utils.js';
import type { NormalizedProfile } from '../../core/types.js';
import type { TelegramLoginWidgetData, TelegramVerifyOptions } from './types.js';

/** Default TTL for auth_date: 24 hours */
const DEFAULT_AUTH_DATE_TTL = 86400;

/**
 * Parse and validate Login Widget data
 * 
 * @param data - The callback data from Login Widget
 * @returns Parsed widget data
 */
export function parseLoginWidgetData(
    data: Record<string, string | number | undefined>
): TelegramLoginWidgetData {
    // Validate required fields
    if (!data.id) {
        throw new TelegramVerificationError('missing_data', 'Missing id field');
    }

    if (!data.first_name) {
        throw new TelegramVerificationError('missing_data', 'Missing first_name field');
    }

    if (!data.auth_date) {
        throw new TelegramVerificationError('missing_data', 'Missing auth_date field');
    }

    if (!data.hash || typeof data.hash !== 'string') {
        throw new TelegramVerificationError('missing_data', 'Missing hash field');
    }

    return {
        id: typeof data.id === 'number' ? data.id : parseInt(String(data.id), 10),
        first_name: String(data.first_name),
        last_name: data.last_name ? String(data.last_name) : undefined,
        username: data.username ? String(data.username) : undefined,
        photo_url: data.photo_url ? String(data.photo_url) : undefined,
        auth_date: typeof data.auth_date === 'number'
            ? data.auth_date
            : parseInt(String(data.auth_date), 10),
        hash: String(data.hash),
    };
}

/**
 * Build the data-check-string for Login Widget verification
 * All fields sorted alphabetically, excluding 'hash'
 * 
 * @param data - The widget data object
 * @returns Data check string
 */
function buildDataCheckString(data: TelegramLoginWidgetData): string {
    const entries: [string, string | number][] = [];

    // Add all fields except hash
    const keys: (keyof TelegramLoginWidgetData)[] = [
        'id', 'first_name', 'last_name', 'username', 'photo_url', 'auth_date'
    ];

    for (const key of keys) {
        const value = data[key];
        if (value !== undefined && value !== null) {
            entries.push([key, value]);
        }
    }

    // Sort alphabetically by key
    entries.sort((a, b) => a[0].localeCompare(b[0]));

    // Join as key=value pairs with newlines
    return entries.map(([k, v]) => `${k}=${v}`).join('\n');
}

/**
 * Verify Telegram Login Widget data
 * 
 * Security steps:
 * 1. Compute SHA256 of botToken
 * 2. Compute HMAC-SHA256 of data-check-string with step 1 result as key
 * 3. Compare result with provided hash using timing-safe comparison
 * 4. Validate auth_date TTL
 * 
 * @param data - The callback data from Login Widget
 * @param botToken - Your Telegram Bot Token
 * @param options - Verification options
 * @returns Verified widget data
 */
export async function verifyLoginWidgetData(
    data: Record<string, string | number | undefined>,
    botToken: string,
    options: TelegramVerifyOptions = {}
): Promise<TelegramLoginWidgetData> {
    const { authDateTTL = DEFAULT_AUTH_DATE_TTL, skipTTLCheck = false } = options;

    // Parse and validate data
    const parsed = parseLoginWidgetData(data);

    // Check TTL
    if (!skipTTLCheck && isExpired(parsed.auth_date, authDateTTL)) {
        throw new TelegramVerificationError(
            'expired',
            `Authentication expired. auth_date is older than ${authDateTTL} seconds.`
        );
    }

    // Build data check string
    const dataCheckString = buildDataCheckString(parsed);

    // Step 1: Create secret key = SHA256(botToken)
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
 * Verify Login Widget data and return normalized profile
 * 
 * @param data - The callback data from Login Widget
 * @param botToken - Your Telegram Bot Token
 * @param options - Verification options
 * @returns Normalized user profile
 */
export async function verifyTelegramLoginWidget(
    data: Record<string, string | number | undefined>,
    botToken: string,
    options: TelegramVerifyOptions = {}
): Promise<NormalizedProfile> {
    const verified = await verifyLoginWidgetData(data, botToken, options);

    return normalizeTelegramLoginWidget(verified);
}

/**
 * Normalize Login Widget data to standard profile
 */
export function normalizeTelegramLoginWidget(
    data: TelegramLoginWidgetData
): NormalizedProfile {
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ');

    return createNormalizedProfile('telegram', String(data.id), {
        name: name || undefined,
        avatarUrl: data.photo_url,
        // Telegram doesn't provide email
        email: undefined,
        raw: data,
    });
}
