# Installation

## Package Installation

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

## Peer Dependencies

If using the Express adapter, install express:

```bash
npm install express express-session
```

## Environment Setup

Create a `.env` file:

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

## TypeScript Configuration

The library exports full TypeScript definitions. Make sure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16"
    "esModuleInterop": true
  }
}
```

## Import Paths

```typescript
// Universal (core + providers)
import { NormalizedProfile } from "auth-kit-js";

// Browser only
import { startOAuth, getTelegramInitData } from "auth-kit-js/frontend";

// Node.js only
import { verifyTelegramWebApp } from "auth-kit-js/backend";

// Express adapter
import { createAuthRouter } from "auth-kit-js/express";

// Core types and utilities
import { AuthKitError, generateState } from "auth-kit-js/core";
```
