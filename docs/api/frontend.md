# Frontend API

Browser-only helpers for OAuth flows and Telegram WebApp.

## OAuth Functions

### startOAuth

Start OAuth flow with redirect.

```typescript
import { startOAuth } from "auth-kit-js/frontend";

startOAuth({
  provider: "google",
  clientId: "your-client-id",
  redirectUri: "http://localhost:3000/callback",
  usePKCE: true,
  scopes: ["openid", "email"],
});
```

### startOAuthPopup

Start OAuth flow in popup window.

```typescript
import { startOAuthPopup } from "auth-kit-js/frontend";

const result = await startOAuthPopup({
  provider: "google",
  clientId: "your-client-id",
  redirectUri: "http://localhost:3000/callback",
});
```

### validateState

Validate OAuth state parameter.

```typescript
import { validateState } from "auth-kit-js/frontend";

const isValid = validateState(stateFromCallback);
```

## Telegram WebApp Functions

### isTelegramWebApp

Check if running inside Telegram.

```typescript
import { isTelegramWebApp } from "auth-kit-js/frontend";

if (isTelegramWebApp()) {
  // Running in Telegram
}
```

### getTelegramInitData

Get raw initData string.

```typescript
import { getTelegramInitData } from "auth-kit-js/frontend";

const initData = getTelegramInitData();
// Send to backend for verification
```

### getTelegramUser

Get user from WebApp (unverified).

```typescript
import { getTelegramUser } from "auth-kit-js/frontend";

const user = getTelegramUser();
console.log(user?.first_name);
```

### initTelegramWebApp

Signal ready to Telegram.

```typescript
import { initTelegramWebApp } from "auth-kit-js/frontend";

initTelegramWebApp();
```

### verifyTelegramWithBackend

Helper to verify with backend.

```typescript
import { verifyTelegramWithBackend } from "auth-kit-js/frontend";

const result = await verifyTelegramWithBackend("/auth/telegram/webapp");
```
