# API Reference

Complete API documentation for auth-kit-js.

## Import Paths

| Path                   | Environment | Description              |
| ---------------------- | ----------- | ------------------------ |
| `auth-kit-js`          | Universal   | Core types and providers |
| `auth-kit-js/frontend` | Browser     | OAuth flow helpers       |
| `auth-kit-js/backend`  | Node.js     | Verification handlers    |
| `auth-kit-js/express`  | Node.js     | Express router           |
| `auth-kit-js/core`     | Universal   | Types, errors, utilities |

## Core Types

### NormalizedProfile

```typescript
interface NormalizedProfile {
  provider: "google" | "facebook" | "telegram";
  providerUserId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  raw: unknown;
}
```

### GoogleOAuthConfig

```typescript
interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}
```

### FacebookOAuthConfig

```typescript
interface FacebookOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}
```

### TelegramConfig

```typescript
interface TelegramConfig {
  botToken: string;
  authDateTTL?: number; // seconds, default: 86400
}
```

## Pages

- [Core](/api/core) - Types, errors, crypto utilities
- [Frontend](/api/frontend) - Browser helpers
- [Backend](/api/backend) - Server handlers
- [Express](/api/express) - Express adapter
