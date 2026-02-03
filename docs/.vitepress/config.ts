import { defineConfig } from 'vitepress'

// Get version from package.json
const pkg = require('../../package.json')

export default defineConfig({
    title: 'Auth-Kit-JS',
    description: 'Universal authentication library for JavaScript/TypeScript',

    // For GitHub Pages - change 'auth-kit-js' to your repo name
    // Use / for Vercel, or /auth-kit-js/ for GitHub Pages
    base: process.env.BASE_URL || '/',

    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
        ['meta', { name: 'theme-color', content: '#667eea' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Auth-Kit-JS' }],
        ['meta', { property: 'og:description', content: 'Universal authentication library' }],
    ],

    themeConfig: {
        logo: '/logo.svg',

        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API', link: '/api/' },
            { text: 'Examples', link: '/examples/' },
            {
                text: 'Providers',
                items: [
                    { text: 'Google', link: '/providers/google' },
                    { text: 'Facebook', link: '/providers/facebook' },
                    { text: 'Telegram', link: '/providers/telegram' },
                ]
            },
            {
                text: `v${pkg.version}`,
                items: [
                    { text: 'Changelog', link: '/changelog' },
                    { text: 'Contributing', link: '/contributing' },
                    {
                        text: 'Versions',
                        items: [
                            { text: `v${pkg.version} (Current)`, link: '/' },
                            // Add previous versions here as they are released
                            // { text: 'v0.1.x', link: 'https://github.com/.../releases/tag/v0.1.0' },
                        ]
                    }
                ]
            }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: 'Introduction',
                    items: [
                        { text: 'Getting Started', link: '/guide/getting-started' },
                        { text: 'Installation', link: '/guide/installation' },
                        { text: 'Quick Start', link: '/guide/quick-start' },
                    ]
                },
                {
                    text: 'Core Concepts',
                    items: [
                        { text: 'Normalized Profile', link: '/guide/normalized-profile' },
                        { text: 'Security', link: '/guide/security' },
                    ]
                }
            ],
            '/providers/': [
                {
                    text: 'OAuth Providers',
                    items: [
                        { text: 'Google', link: '/providers/google' },
                        { text: 'Facebook', link: '/providers/facebook' },
                    ]
                },
                {
                    text: 'Other Providers',
                    items: [
                        { text: 'Telegram', link: '/providers/telegram' },
                    ]
                }
            ],
            '/api/': [
                {
                    text: 'API Reference',
                    items: [
                        { text: 'Overview', link: '/api/' },
                        { text: 'Core', link: '/api/core' },
                        { text: 'Frontend', link: '/api/frontend' },
                        { text: 'Backend', link: '/api/backend' },
                        { text: 'Express', link: '/api/express' },
                    ]
                }
            ],
            '/examples/': [
                {
                    text: 'Examples',
                    items: [
                        { text: 'Overview', link: '/examples/' },
                        { text: 'Express Backend', link: '/examples/express' },
                        { text: 'React Frontend', link: '/examples/react' },
                        { text: 'Telegram WebApp', link: '/examples/telegram-webapp' },
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/Xushnud9812/auth-kit-js' }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: `Copyright © 2024-${new Date().getFullYear()}`
        },

        search: {
            provider: 'local'
        },

        editLink: {
            pattern: 'https://github.com/Xushnud9812/auth-kit-js/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },

        lastUpdated: {
            text: 'Updated at',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'short'
            }
        }
    },

    lastUpdated: true,

    sitemap: {
        hostname: 'https://Xushnud9812.github.io/auth-kit-js/'
    }
})
