/**
 * Auth-Kit-JS: Backend Telegram Handler
 * 
 * Server-side Telegram verification
 */

import { verifyTelegramWebApp as verifyWebApp } from '../providers/telegram/webapp.js';
import { verifyTelegramLoginWidget as verifyWidget } from '../providers/telegram/widget.js';
import type { NormalizedProfile, TelegramConfig } from '../core/types.js';
import type { TelegramVerifyOptions } from '../providers/telegram/types.js';

export { verifyWebApp as verifyTelegramWebApp };
export { verifyWidget as verifyTelegramLoginWidget };

/**
 * Create Telegram verification handler with pre-configured options
 * 
 * @param config - Telegram configuration
 * @returns Verification functions
 */
export function createTelegramHandler(config: TelegramConfig) {
    const options: TelegramVerifyOptions = {
        authDateTTL: config.authDateTTL,
    };

    return {
        /**
         * Verify Telegram WebApp initData
         * 
         * @param initData - Raw initData string from Telegram WebApp
         * @returns Normalized user profile
         */
        async verifyWebApp(initData: string): Promise<NormalizedProfile> {
            return verifyWebApp(initData, config.botToken, options);
        },

        /**
         * Verify Telegram Login Widget data
         * 
         * @param data - Widget callback data
         * @returns Normalized user profile
         */
        async verifyLoginWidget(
            data: Record<string, string | number | undefined>
        ): Promise<NormalizedProfile> {
            return verifyWidget(data, config.botToken, options);
        },

        /**
         * Get verification options
         */
        getOptions(): TelegramVerifyOptions {
            return { ...options };
        },
    };
}
