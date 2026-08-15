import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves the Hono app (src/server/index.ts) under /api in development.
// Note: GET/HEAD only — request bodies are not forwarded yet.
function honoApi(): Plugin {
  return {
    name: 'hono-api',
    configureServer(server) {
      server.middlewares.use('/api', (req, res) => {
        void (async () => {
          try {
            const { default: app } = (await server.ssrLoadModule('/src/server/index.ts')) as {
              default: { fetch: (request: Request) => Promise<Response> }
            }

            const headers = new Headers()
            for (const [key, value] of Object.entries(req.headers)) {
              if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value)
            }

            const url = new URL(`/api${req.url ?? ''}`, 'http://localhost')
            const response = await app.fetch(new Request(url, { method: req.method, headers }))

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
