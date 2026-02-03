# Frontend API

Browser-only helpers for OAuth flows.

## Google & Facebook OAuth

### startOAuth

Start OAuth flow with redirect.

```typescript
import { startOAuth } from "@xushnud_bek/auth-kit-js/frontend";

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
import { startOAuthPopup } from "@xushnud_bek/auth-kit-js/frontend";

const result = await startOAuthPopup({
  provider: "google",
  clientId: "your-client-id",
  redirectUri: "http://localhost:3000/callback",
});
```

### validateState

Validate OAuth state parameter.

```typescript
import { validateState } from "@xushnud_bek/auth-kit-js/frontend";

const isValid = validateState(stateFromCallback);
```

## Telegram OAuth

### startTelegramOAuth

Start Telegram OAuth flow.

```typescript
import { startTelegramOAuth } from "@xushnud_bek/auth-kit-js/frontend";

// Redirect mode
startTelegramOAuth({
  botId: "5323903014",
  redirectUri: "http://localhost:3000/auth/telegram/callback",
});

// Popup mode
const result = await startTelegramOAuth({
  botId: "5323903014",
  redirectUri: "http://localhost:3000/auth/telegram/callback",
  popup: true,
});
```

### handleTelegramOAuthCallback

Handle Telegram OAuth callback on your callback page.

```typescript
import { handleTelegramOAuthCallback } from "@xushnud_bek/auth-kit-js/frontend";

const authData = handleTelegramOAuthCallback();
if (authData) {
  // Send to backend for verification
  fetch("/auth/telegram/oauth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authData),
  });
}
```

## Types

```typescript
interface TelegramOAuthOptions {
  botId: string;
  redirectUri: string;
  popup?: boolean;
  popupWidth?: number;
  popupHeight?: number;
}

interface TelegramOAuthResult {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}
```
