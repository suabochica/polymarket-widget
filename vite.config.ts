import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves the Hono app (api/_server/index.ts) under /api in development,
// exposing .env variables as Workers-style bindings (c.env).
function honoApi(): Plugin {
  return {
    name: 'hono-api',
    configureServer(server) {
      const env = { ...loadEnv(server.config.mode, server.config.root, ''), ...process.env }

      server.middlewares.use('/api', (req, res) => {
        void (async () => {
          try {
            const { default: app } = (await server.ssrLoadModule('/api/_server/index.ts')) as {
              default: { fetch: (request: Request, env?: unknown) => Promise<Response> }
            }

            const headers = new Headers()
            for (const [key, value] of Object.entries(req.headers)) {
              if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value)
            }
            headers.delete('content-length')

            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)

            const method = req.method ?? 'GET'
            const body = chunks.length > 0 && method !== 'GET' && method !== 'HEAD' ? Buffer.concat(chunks) : undefined
            const url = new URL(`/api${req.url ?? ''}`, 'http://localhost')
            const response = await app.fetch(new Request(url, { method, headers, body }), env)

            res.statusCode = response.status
            response.headers.forEach((value, key) => res.setHeader(key, value))
            res.end(Buffer.from(await response.arrayBuffer()))
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: String(error) }))
          }
        })()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), honoApi()],
})
