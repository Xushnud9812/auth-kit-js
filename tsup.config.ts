import { defineConfig } from 'tsup';

export default defineConfig([
    // Main entry point (universal)
    {
        entry: {
            index: 'src/index.ts',
            'index.browser': 'src/index.browser.ts',
            'index.node': 'src/index.node.ts',
        },
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        clean: true,
        splitting: false,
        treeshake: true,
    },
    // Core module
    {
        entry: {
            'core/index': 'src/core/index.ts',
        },
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        splitting: false,
        treeshake: true,
    },
    // Frontend module (browser-only)
    {
        entry: {
            'frontend/index': 'src/frontend/index.ts',
        },
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        platform: 'browser',
        splitting: false,
        treeshake: true,
    },
    // Backend module (node-only)
    {
        entry: {
            'backend/index': 'src/backend/index.ts',
        },
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        platform: 'node',
        splitting: false,
        treeshake: true,
    },
    // Express adapter
    {
        entry: {
            'adapters/express/index': 'src/adapters/express/index.ts',
        },
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        platform: 'node',
        splitting: false,
        treeshake: true,
        external: ['express'],
    },
]);
