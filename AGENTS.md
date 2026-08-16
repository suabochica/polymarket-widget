# AGENTS.md

## Project Context
- Tech Stack: React 19, TypeScript, Tailwind CSS, Vite, Hono, and Wrangler.
- Core Business Logic: Located inside `/src/server`.
- Presentation Logic: Located inside `/src/client`.
- Cross-cutting utilities: Located inside `/src/shared`.

## Data Providers:
- Polymarket: The world's largest decentralized prediction market platform
- OpenRouter: A unified API aggregator and marketplace for large language models (LLMs)

## Critical Restrictions
- Never expose raw API keys or hardcode secrets.
- Do not use 'let' or 'var' if 'const' can be applied.
- Do not install new npm dependencies without explicit confirmation.

## Common Commands
- Development: `pnpm dev`
- Build: `pnpm build`
- Linting: `pnpm lint`

## Testing Guidelines
- Testing Tool: Vitest
- Command: `pnpm test`
- Rule: Always generate a matching `.test.ts` file next to any new utility file.

## Definition of Done
- Code must pass `pnpm lint` and `pnpm test`.
- Document any new public functions directly in `docs/api.md`.

