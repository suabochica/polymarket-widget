import app from './_server/index.ts'

// Vercel serverless function serving the Hono app under /api in production.
// Vercel only ships the api/ directory (plus node_modules) into the lambda,
// so the Hono app lives here in ./_server. The dev middleware
// (vite.config.ts) loads the same file. `process.env` is passed as Hono
// bindings so OPENROUTER_API_KEY/POLYMARKET_MODEL and the D1 binding (when
// present) land in c.env. Without a DB binding, the ledger falls back to
// the in-memory store.

async function handler(request: Request): Promise<Response> {
  return app.fetch(request, process.env as Record<string, string | undefined>)
}

export const config = { runtime: 'nodejs' }

export const GET = handler
export const POST = handler