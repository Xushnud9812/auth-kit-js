/**
 * Auth-Kit-JS: Node.js Entry Point
 * 
 * Node.js-only exports (includes backend handlers)
 */

// Core exports
export * from './core/index.js';

// All provider exports
export * from './providers/index.js';

// Backend-specific exports
export * from './backend/index.js';

// Express adapter
export { createAuthRouter, getConfiguredProviders, type AuthRouterConfig } from './adapters/express/index.js';
