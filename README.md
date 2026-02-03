# @xushnud_bek/auth-kit-js

A **universal**, **secure**, and **tree-shakeable** authentication library for JavaScript/TypeScript, supporting **OAuth** for:

- 🔵 **Google OAuth2**
- 🔵 **Facebook OAuth2**
- 🔵 **Telegram OAuth** (via oauth.telegram.org)

## Features

- ✅ **Universal** - Works in both browser and Node.js
- ✅ **TypeScript-first** - Full type definitions included
- ✅ **Secure by default** - PKCE, HMAC verification, timing-safe comparisons
- ✅ **Tree-shakeable** - Import only what you need
- ✅ **Framework-agnostic** - Use with any framework (Express adapter included)
- ✅ **Normalized profiles** - Unified user data across all providers

## Installation

```bash
npm install @xushnud_bek/auth-kit-js
```

## Quick Start

### Express Backend

```typescript
import express from "express";
import session from "express-session";
import { createAuthRouter } from "@xushnud_bek/auth-kit-js/express";

const app = express();
app.use(express.json());
app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: false }),
);

const authRouter = createAuthRouter({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "http://localhost:3000/auth/google/callback",
  },
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    redirectUri: "http://localhost:3000/auth/facebook/callback",
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
  },
  async onLogin(profile) {
    console.log("User logged in:", profile);
    return { token: "your-jwt-token" };
  },
});

app.use("/auth", authRouter);
app.listen(3000);
```

### Frontend

```typescript
import {
  startOAuth,
  startTelegramOAuth,
} from "@xushnud_bek/auth-kit-js/frontend";

// Google OAuth
document.getElementById("google-btn").onclick = () => {
  startOAuth({
    provider: "google",
    clientId: "your-google-client-id",
    redirectUri: "http://localhost:3000/auth/google/callback",
    usePKCE: true,
  });
};

// Facebook OAuth
document.getElementById("facebook-btn").onclick = () => {
  startOAuth({
    provider: "facebook",
    clientId: "your-facebook-app-id",
    redirectUri: "http://localhost:3000/auth/facebook/callback",
  });
};

// Telegram OAuth
document.getElementById("telegram-btn").onclick = () => {
  startTelegramOAuth({
    botId: "5323903014", // Your bot ID
    redirectUri: "http://localhost:3000/auth/telegram/callback",
  });
};
```

### Telegram Callback Page

```typescript
import { handleTelegramOAuthCallback } from "@xushnud_bek/auth-kit-js/frontend";

const authData = handleTelegramOAuthCallback();
if (authData) {
  fetch("/auth/telegram/oauth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authData),
  });
}
```

## API Routes Created

| Route                    | Description              |
| ------------------------ | ------------------------ |
| `GET /google`            | Start Google OAuth       |
| `GET /google/callback`   | Handle Google callback   |
| `GET /facebook`          | Start Facebook OAuth     |
| `GET /facebook/callback` | Handle Facebook callback |
| `POST /telegram/oauth`   | Verify Telegram OAuth    |

## Normalized Profile

All providers return a unified profile:

```typescript
interface NormalizedProfile {
  provider: "google" | "facebook" | "telegram";
  providerUserId: string;
  email?: string; // Not available for Telegram
  name?: string;
  avatarUrl?: string;
  raw: unknown; // Original provider response
}
```

## Security

- ✅ **PKCE** - Code challenge with S256 method
- ✅ **State parameter** - CSRF protection
- ✅ **HMAC-SHA256** - Telegram verification
- ✅ **Timing-safe comparison** - Prevents timing attacks
- ✅ **auth_date TTL** - Rejects expired authentications

## Environment Variables

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
TELEGRAM_BOT_TOKEN=your-bot-token
```

## Tree Shaking

```typescript
// Frontend only
import {
  startOAuth,
  startTelegramOAuth,
} from "@xushnud_bek/auth-kit-js/frontend";

// Backend only
import { verifyTelegramOAuth } from "@xushnud_bek/auth-kit-js/backend";

// Express adapter
import { createAuthRouter } from "@xushnud_bek/auth-kit-js/express";

// Core types
import { NormalizedProfile, AuthKitError } from "@xushnud_bek/auth-kit-js/core";
```

## Documentation

Full documentation: https://xushnud9812.github.io/auth-kit-js/

## License

MIT
