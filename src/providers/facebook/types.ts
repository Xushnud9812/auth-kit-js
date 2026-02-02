/**
 * Auth-Kit-JS: Facebook Provider Types
 */

import type { OAuthConfig } from '../../core/types.js';

/**
 * Facebook OAuth configuration
 */
export interface FacebookConfig extends OAuthConfig {
    /** Auth type: 'rerequest' to re-ask for declined permissions */
    authType?: 'rerequest';
    /** Display mode for login dialog */
    display?: 'page' | 'popup' | 'touch';
}

/**
 * Facebook OAuth authorization URL parameters
 */
export interface FacebookAuthUrlParams {
    /** App ID (client ID) */
    clientId: string;
    /** Redirect URI */
    redirectUri: string;
    /** Scopes to request */
    scopes?: string[];
    /** State parameter for CSRF protection */
    state: string;
    /** Response type */
    responseType?: 'code';
    /** Auth type */
    authType?: 'rerequest';
    /** Display mode */
    display?: 'page' | 'popup' | 'touch';
}

/**
 * Facebook token response
 */
export interface FacebookTokenResponse {
    /** Access token */
    access_token: string;
    /** Token type (usually 'bearer') */
    token_type: string;
    /** Expiration time in seconds */
    expires_in: number;
}

/**
 * Facebook user profile
 */
export interface FacebookUserProfile {
    /** User ID */
    id: string;
    /** User's name */
    name?: string;
    /** User's email (requires email permission) */
    email?: string;
    /** User's first name */
    first_name?: string;
    /** User's last name */
    last_name?: string;
    /** Profile picture data */
    picture?: {
        data: {
            url: string;
            width: number;
            height: number;
            is_silhouette: boolean;
        };
    };
}

/**
 * Facebook error response
 */
export interface FacebookErrorResponse {
    error: {
        message: string;
        type: string;
        code: number;
        error_subcode?: number;
        fbtrace_id?: string;
    };
}
