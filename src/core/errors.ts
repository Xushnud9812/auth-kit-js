/**
 * Auth-Kit-JS: Custom Errors
 * 
 * Structured error classes for better error handling
 */

/**
 * Base error class for Auth Kit
 */
export class AuthKitError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(message: string, code: string = 'AUTH_KIT_ERROR', statusCode: number = 400) {
        super(message);
        this.name = 'AuthKitError';
        this.code = code;
        this.statusCode = statusCode;

        // Maintain proper stack trace in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
        };
    }
}

/**
 * OAuth-specific errors
 */
export class OAuthError extends AuthKitError {
    public readonly provider: string;
    public readonly originalError?: string;

    constructor(
        message: string,
        provider: string,
        code: string = 'OAUTH_ERROR',
        originalError?: string
    ) {
        super(message, code, 401);
        this.name = 'OAuthError';
        this.provider = provider;
        this.originalError = originalError;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            provider: this.provider,
            originalError: this.originalError,
        };
    }
}

/**
 * Invalid OAuth state error (CSRF protection)
 */
export class InvalidStateError extends OAuthError {
    constructor(provider: string) {
        super(
            'Invalid or expired OAuth state. Please try again.',
            provider,
            'INVALID_STATE'
        );
        this.name = 'InvalidStateError';
    }
}

/**
 * OAuth code exchange failure
 */
export class CodeExchangeError extends OAuthError {
    constructor(provider: string, originalError?: string) {
        super(
            'Failed to exchange authorization code for tokens',
            provider,
            'CODE_EXCHANGE_FAILED',
            originalError
        );
        this.name = 'CodeExchangeError';
    }
}

/**
 * Invalid redirect URI error
 */
export class InvalidRedirectError extends AuthKitError {
    public readonly attemptedUri: string;

    constructor(attemptedUri: string) {
        super(
            'Invalid redirect URI',
            'INVALID_REDIRECT',
            400
        );
        this.name = 'InvalidRedirectError';
        this.attemptedUri = attemptedUri;
    }
}

/**
 * Telegram verification errors
 */
export class TelegramVerificationError extends AuthKitError {
    public readonly reason: 'invalid_hash' | 'expired' | 'missing_data' | 'invalid_format';

    constructor(
        reason: 'invalid_hash' | 'expired' | 'missing_data' | 'invalid_format',
        message?: string
    ) {
        const messages: Record<typeof reason, string> = {
            invalid_hash: 'Telegram data verification failed: invalid hash',
            expired: 'Telegram authentication has expired',
            missing_data: 'Required Telegram data is missing',
            invalid_format: 'Telegram data format is invalid',
        };

        super(message || messages[reason], 'TELEGRAM_VERIFICATION_FAILED', 401);
        this.name = 'TelegramVerificationError';
        this.reason = reason;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            reason: this.reason,
        };
    }
}

/**
 * Configuration error
 */
export class ConfigurationError extends AuthKitError {
    public readonly configKey: string;

    constructor(message: string, configKey: string) {
        super(message, 'CONFIGURATION_ERROR', 500);
        this.name = 'ConfigurationError';
        this.configKey = configKey;
    }
}

/**
 * Provider not configured error
 */
export class ProviderNotConfiguredError extends ConfigurationError {
    constructor(provider: string) {
        super(
            `Provider "${provider}" is not configured`,
            provider
        );
        this.name = 'ProviderNotConfiguredError';
    }
}
