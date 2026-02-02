# Getting Started

Auth-Kit-JS is a universal authentication library that provides a unified API for multiple authentication providers.

## Features

- **Google OAuth2/OIDC** - Full OpenID Connect support with ID token verification
- **Facebook OAuth2** - Graph API integration with profile fetching
- **Telegram** - WebApp initData and Login Widget verification
- **Universal** - Works in browsers and Node.js
- **Type-Safe** - Full TypeScript support
- **Secure** - PKCE, HMAC, timing-safe comparisons

## Installation

::: code-group

```bash [npm]
npm install auth-kit-js
```

```bash [yarn]
yarn add auth-kit-js
```

```bash [pnpm]
pnpm add auth-kit-js
```

:::

## Basic Usage

### Backend (Express)

```typescript
import express from "express";
import session from "express-session";
import { createAuthRouter } from "auth-kit-js/express";

const app = express();

app.use(session({ secret: "your-secret" }));

const authRouter = createAuthRouter({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "http://localhost:3000/auth/google/callback",
  },
  async onLogin(profile) {
    console.log("User:", profile);
    return { token: "your-jwt-token" };
  },
});

app.use("/auth", authRouter);
app.listen(3000);
```

### Frontend

```typescript
import { startOAuth } from "auth-kit-js/frontend";

// Start Google OAuth
document.getElementById("login-btn").onclick = () => {
  startOAuth({
    provider: "google",
    clientId: "your-client-id",
    redirectUri: "http://localhost:3000/auth/google/callback",
    usePKCE: true,
  });
};
```

## Next Steps

- [Installation Guide](/guide/installation) - Detailed setup instructions
- [Quick Start](/guide/quick-start) - Build your first auth flow
- [Security](/guide/security) - Understand security features
