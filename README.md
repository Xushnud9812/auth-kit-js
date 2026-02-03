# auth-kit-js

A **universal**, **secure**, and **tree-shakeable** authentication library for JavaScript/TypeScript, supporting:

- **Google OAuth2**
- **Facebook OAuth2**
- **Telegram** (WebApp initData + Login Widget)

## Features

- ✅ **Universal** - Works in both browser and Node.js
- ✅ **TypeScript-first** - Full type definitions included
- ✅ **Secure by default** - PKCE, HMAC verification, timing-safe comparisons
- ✅ **Tree-shakeable** - Import only what you need
- ✅ **Framework-agnostic** - Use with any framework (Express adapter included)
- ✅ **Normalized profiles** - Unified user data across all providers

## Installation

```bash
npm install auth-kit-js
```

## Quick Start

### Express Backend

```typescript
import express from "express";
import session from "express-session";
import { createAuthRouter } from "auth-kit-js/express";

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Create auth router
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
  async onLogin(profile, req) {
    // Create or update user in your database
    console.log("User logged in:", profile);

    // Return a token (JWT, session ID, etc.)
    return { token: "your-auth-token" };
  },
});

app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### Frontend (React/Vue/Vanilla)

```typescript
import {
  startOAuth,
  getTelegramInitData,
  isTelegramWebApp,
} from "auth-kit-js/frontend";

// Start Google OAuth
document.getElementById("google-btn")?.addEventListener("click", () => {
  startOAuth({
    provider: "google",
    clientId: "your-google-client-id",
    redirectUri: "http://localhost:3000/auth/google/callback",
    usePKCE: true, // Recommended
  });
});

// Start Facebook OAuth
document.getElementById("facebook-btn")?.addEventListener("click", () => {
  startOAuth({
    provider: "facebook",
    clientId: "your-facebook-app-id",
    redirectUri: "http://localhost:3000/auth/facebook/callback",
  });
});

// Telegram WebApp
if (isTelegramWebApp()) {
  const initData = getTelegramInitData();

  // Send to your backend for verification
  fetch("/auth/telegram/webapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });
}
```

### Telegram WebApp

```typescript
import {
  isTelegramWebApp,
  getTelegramInitData,
  getTelegramUser,
  initTelegramWebApp,
  verifyTelegramWithBackend,
} from "auth-kit-js/frontend";

// Check if running in Telegram
if (isTelegramWebApp()) {
  // Signal that your app is ready
  initTelegramWebApp();

  // Get user info (unverified - for display only)
  const user = getTelegramUser();
  console.log("Hello,", user?.first_name);

  // Verify with your backend
  const result = await verifyTelegramWithBackend("/auth/telegram/webapp");
  console.log("Authenticated:", result);
}
```

## API Reference

### Core Types

```typescript
// Normalized profile returned by all providers
interface NormalizedProfile {
  provider: "google" | "facebook" | "telegram";
  providerUserId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  raw: unknown; // Original provider response
}
```

### Express Adapter

```typescript
import { createAuthRouter, AuthRouterConfig } from 'auth-kit-js/express';

const router = createAuthRouter({
  google?: GoogleOAuthConfig,
  facebook?: FacebookOAuthConfig,
  telegram?: TelegramConfig,
  onLogin: (profile, req) => Promise<{ token: string }>,
  onError?: (error, req, res) => void,
  successRedirect?: string,
  errorRedirect?: string,
  usePKCE?: boolean, // default: true
});
```

**Routes created:**

- `GET /google` - Start Google OAuth
- `GET /google/callback` - Handle Google callback
- `GET /facebook` - Start Facebook OAuth
- `GET /facebook/callback` - Handle Facebook callback
- `POST /telegram/webapp` - Verify Telegram WebApp initData
- `POST /telegram/widget` - Verify Telegram Login Widget

### Frontend Helpers

```typescript
import {
  startOAuth,
  startOAuthPopup,
  getAuthButtons,
  getTelegramInitData,
  isTelegramWebApp,
} from "auth-kit-js/frontend";
```

### Backend Helpers

```typescript
import {
  handleOAuthCallback,
  createOAuthHandler,
  verifyTelegramWebApp,
  verifyTelegramLoginWidget,
  createTelegramHandler,
} from "auth-kit-js/backend";
```

## Security

### OAuth Security

- ✅ **State parameter** - CSRF protection with cryptographically random state
- ✅ **PKCE support** - Code challenge with S256 method (enabled by default for Google)
- ✅ **Secure redirect validation** - Prevents open redirect vulnerabilities

### Telegram Security

- ✅ **HMAC-SHA256 verification** - Cryptographic verification of initData
- ✅ **Timing-safe comparison** - Prevents timing attacks
- ✅ **auth_date TTL** - Rejects expired authentications (default: 24 hours)

### Cookie Security

- ✅ **httpOnly** - Prevents XSS token theft
- ✅ **sameSite=lax** - CSRF protection
- ✅ **secure** - HTTPS-only in production

## Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
```

## Tree Shaking

Import only what you need:

```typescript
// Frontend only (no Node.js code)
import { startOAuth } from "auth-kit-js/frontend";

// Backend only (no browser code)
import { verifyTelegramWebApp } from "auth-kit-js/backend";

// Express adapter
import { createAuthRouter } from "auth-kit-js/express";

// Core types and utilities
import { NormalizedProfile, AuthKitError } from "auth-kit-js/core";
```

## Browser Support

- Chrome 67+
- Firefox 68+
- Safari 14+
- Edge 79+

Requires Web Crypto API support.

## Node.js Support

- Node.js 18+

## License

MIT
