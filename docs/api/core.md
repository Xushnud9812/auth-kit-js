# Core API

Types, errors, and utility functions.

## Types

```typescript
import type {
  NormalizedProfile,
  GoogleOAuthConfig,
  FacebookOAuthConfig,
  TelegramConfig,
  AuthKitConfig,
} from "auth-kit-js/core";
```

## Error Classes

### AuthKitError

Base error class.

```typescript
import { AuthKitError } from "auth-kit-js/core";

try {
  // ...
} catch (error) {
  if (error instanceof AuthKitError) {
    console.log(error.code); // ERROR_CODE
    console.log(error.statusCode); // HTTP status
  }
}
```

### OAuthError

OAuth-specific errors.

```typescript
import { OAuthError } from "auth-kit-js/core";
```

### TelegramVerificationError

Telegram verification errors.

```typescript
import { TelegramVerificationError } from "auth-kit-js/core";

// error.code can be:
// - 'invalid_hash'
// - 'expired'
// - 'missing_data'
```

## Crypto Utilities

### generateState

Generate OAuth state parameter.

```typescript
import { generateState } from "auth-kit-js/core";

const state = generateState(); // Random 32-char string
```

### generateCodeVerifier / generateCodeChallenge

PKCE helpers.

```typescript
import { generateCodeVerifier, generateCodeChallenge } from "auth-kit-js/core";

const verifier = generateCodeVerifier();
const challenge = await generateCodeChallenge(verifier);
```

### timingSafeEqual

Timing-safe string comparison.

```typescript
import { timingSafeEqual } from "auth-kit-js/core";

const isEqual = timingSafeEqual(a, b);
```
