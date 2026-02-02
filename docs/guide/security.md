# Security

Auth-Kit-JS implements security best practices by default.

## OAuth Security

### State Parameter

CSRF protection using cryptographically random state:

```typescript
import { generateState } from "auth-kit-js/core";

const state = generateState(); // 32-byte random string
```

The state is:

- Generated using Web Crypto API
- Stored in session before redirect
- Validated on callback

### PKCE (Proof Key for Code Exchange)

Enabled by default for Google OAuth:

```typescript
createAuthRouter({
  google: { ... },
  usePKCE: true, // default
});
```

PKCE prevents authorization code interception attacks.

## Telegram Security

### HMAC-SHA256 Verification

```typescript
// Step 1: SHA256(botToken) → secretKey
// Step 2: HMAC_SHA256(secretKey, dataCheckString) → hash
// Step 3: Compare hash with provided hash
```

### Timing-Safe Comparison

Prevents timing attacks:

```typescript
import { timingSafeEqual } from "auth-kit-js/core";

// Safe comparison that takes constant time
const isValid = timingSafeEqual(computedHash, providedHash);
```

### auth_date TTL

Rejects old authentications:

```typescript
telegram: {
  botToken: '...',
  authDateTTL: 86400, // 24 hours (default)
}
```

## Cookie Security

When using `successRedirect`, cookies are set with:

```typescript
{
  httpOnly: true,      // No JS access
  secure: true,        // HTTPS only (in production)
  sameSite: 'lax',     // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}
```

## Best Practices

1. **Always use HTTPS** in production
2. **Validate redirect URIs** - don't accept arbitrary URLs
3. **Store secrets securely** - use environment variables
4. **Rotate tokens** - implement token refresh
5. **Log authentication events** - monitor for suspicious activity
