# Telegram Authentication

Telegram authentication via `oauth.telegram.org` - the official Telegram OAuth flow.

## How It Works

1. User clicks "Login with Telegram" button
2. User is redirected to `oauth.telegram.org`
3. User enters phone number and verifies via Telegram
4. User is redirected back to your site with auth data
5. Your backend verifies the data

## Frontend Setup

```typescript
import {
  startTelegramOAuth,
  handleTelegramOAuthCallback,
} from "@xushnud_bek/auth-kit-js/frontend";

// Start OAuth (redirect mode)
document.getElementById("telegram-btn").onclick = () => {
  startTelegramOAuth({
    botId: "5323903014", // Your bot ID (from @BotFather)
    redirectUri: "https://yoursite.com/auth/telegram/callback",
  });
};
```

## Callback Page

```typescript
import { handleTelegramOAuthCallback } from "@xushnud_bek/auth-kit-js/frontend";

// On your callback page
const authData = handleTelegramOAuthCallback();

if (authData) {
  // Send to backend for verification
  const response = await fetch("/auth/telegram/oauth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authData),
  });

  const { success, token } = await response.json();
  if (success) {
    localStorage.setItem("token", token);
  }
}
```

## Backend Setup

```typescript
import { createAuthRouter } from "@xushnud_bek/auth-kit-js/express";

const authRouter = createAuthRouter({
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    authDateTTL: 86400, // 24 hours (optional)
  },
  async onLogin(profile) {
    return { token: createJWT(profile) };
  },
});

app.use("/auth", authRouter);
```

## Routes Created

| Route                  | Description                |
| ---------------------- | -------------------------- |
| `POST /telegram/oauth` | Verify Telegram OAuth data |

## Getting Bot ID

Your bot ID is the numeric part before the colon in your bot token:

```
5323903014:AAH... → Bot ID = 5323903014
```

You can also use the helper function:

```typescript
import { extractBotId } from "@xushnud_bek/auth-kit-js";

const botId = extractBotId(process.env.TELEGRAM_BOT_TOKEN!);
// Returns: "5323903014"
```

## Security

Telegram OAuth verification uses **HMAC-SHA256**:

1. Creates secret key from HMAC-SHA256("WebAppData", botToken)
2. Computes HMAC of data-check-string
3. Compares with provided hash
4. Validates auth_date TTL (default: 24 hours)

## Profile Data

```typescript
interface NormalizedProfile {
  provider: "telegram";
  providerUserId: string; // Telegram user ID
  name: string; // First + Last name
  avatarUrl?: string; // Photo URL (if available)
  email: undefined; // Telegram doesn't provide email
  raw: TelegramOAuthData;
}
```

::: warning
Telegram **does not** provide user email addresses. Plan your user flow accordingly.
:::
