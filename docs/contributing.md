# Contributing

Thank you for your interest in contributing to Auth-Kit-JS!

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/example/auth-kit-js.git
cd auth-kit-js
```

2. Install dependencies:

```bash
npm install
```

3. Build the library:

```bash
npm run build
```

4. Run tests:

```bash
npm test
```

## Development Commands

| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run build`      | Build the library         |
| `npm run dev`        | Watch mode                |
| `npm run test`       | Run tests                 |
| `npm run docs:dev`   | Start docs dev server     |
| `npm run docs:build` | Build docs for production |

## Project Structure

```
auth-kit-js/
├── src/
│   ├── core/           # Types, errors, crypto
│   ├── providers/      # Google, Facebook, Telegram
│   ├── frontend/       # Browser helpers
│   ├── backend/        # Node.js handlers
│   └── adapters/       # Express integration
├── docs/               # VitePress documentation
├── examples/           # Usage examples
└── dist/               # Built output
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

- Use TypeScript for all code
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Write tests for new features

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
