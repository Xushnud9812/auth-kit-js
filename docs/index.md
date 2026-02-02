---
layout: home

hero:
  name: Auth-Kit-JS
  text: Universal Authentication for JavaScript
  tagline: Secure, type-safe, and tree-shakeable authentication library
  image:
    src: /logo.svg
    alt: Auth-Kit-JS
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/example/auth-kit-js

features:
  - icon: 🔐
    title: Multi-Provider Support
    details: Google OAuth2/OIDC, Facebook OAuth2, and Telegram (WebApp + Login Widget) out of the box.
  - icon: 🛡️
    title: Secure by Default
    details: PKCE, HMAC verification, timing-safe comparisons, and OAuth state protection built-in.
  - icon: 🌍
    title: Universal
    details: Works in both browser and Node.js environments with conditional exports.
  - icon: 📦
    title: Tree-Shakeable
    details: Import only what you need. Separate browser and server bundles for optimal bundle size.
  - icon: 🎯
    title: TypeScript First
    details: Full type definitions with generics support. Excellent IDE autocompletion.
  - icon: ⚡
    title: Express Ready
    details: Zero-config Express adapter with all routes pre-configured.
---

## Quick Example

```typescript
import { createAuthRouter } from "auth-kit-js/express";

const authRouter = createAuthRouter({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/auth/google/callback",
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
  },
  async onLogin(profile) {
    // User authenticated!
    return { token: generateToken(profile) };
  },
});

app.use("/auth", authRouter);
```
