import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/chat' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { message, history } = JSON.parse(body || '{}');
                  const { generateChatResponse } = await import('./src/services/aiService.ts');
                  const reply = await generateChatResponse(message, history || []);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ reply }));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message || 'Internal server error' }));
                }
              });
              return;
            }

            if (req.url === '/api/analyze-news' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { title, content } = JSON.parse(body || '{}');
                  const { analyzeNewsSentimentAI } = await import('./src/services/aiService.ts');
                  const analysis = await analyzeNewsSentimentAI(title || '', content || '');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(analysis));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message || 'Internal server error' }));
                }
              });
              return;
            }

            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
