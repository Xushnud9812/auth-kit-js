# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-XX-XX

### Added

- 🎉 Initial release
- ✅ Google OAuth2/OIDC support with PKCE
- ✅ Facebook OAuth2 support
- ✅ Telegram WebApp verification
- ✅ Telegram Login Widget verification
- ✅ Express.js adapter with `createAuthRouter()`
- ✅ Frontend helpers (`startOAuth`, `getTelegramInitData`)
- ✅ Backend handlers (`verifyTelegramWebApp`, `handleOAuthCallback`)
- ✅ Full TypeScript support
- ✅ ESM and CJS builds
- ✅ Tree-shakeable exports

### Security

- OAuth state parameter for CSRF protection
- PKCE (S256) support for Google
- HMAC-SHA256 verification for Telegram
- Timing-safe comparison for hash verification
- auth_date TTL validation (24h default)

---

## Version History

| Version | Date | Description     |
| ------- | ---- | --------------- |
| 0.1.0   | TBD  | Initial release |
