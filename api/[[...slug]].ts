import app from '../src/server/index.ts'

// Vercel serverless function serving the Hono app under /api in production.
// The dev middleware (vite.config.ts) is Vite-only; Vercel invokes this
// entrypoint instead. `process.env` is passed as Hono bindings so
// OPENROUTER_API_KEY/POLYMARKET_MODEL and the D1 binding (when present)
// land in c.env. Without a DB binding, the ledger falls back to in-memory.

async function handler(request: Request): Promise<Response> {
  return app.fetch(request, process.env as Record<string, string | undefined>)
}

export const config = { runtime: 'nodejs' }

export const GET = handler
export const POST = handler