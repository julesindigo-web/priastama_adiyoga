import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// ─── Environment resolution ────────────────────────────────────────────────────
// PORT is only required in dev/preview mode; Vercel build never uses it.
const isProduction = process.env.NODE_ENV === 'production';
const isReplitEnv  = Boolean(process.env.REPL_ID);

const rawPort = process.env.PORT;
if (!rawPort && !isProduction) {
  throw new Error('PORT environment variable is required but was not provided.');
}
const port = rawPort ? Number(rawPort) : 3000;
if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// BASE_PATH must be '/' for Vercel; in Replit it's the artifact sub-path.
// The build command in vercel.json sets BASE_PATH=/ explicitly.
const basePath = process.env.BASE_PATH ?? '/';
if (!process.env.BASE_PATH && !isProduction) {
  throw new Error('BASE_PATH environment variable is required but was not provided.');
}

// ─── Replit-specific plugins (dev only) ───────────────────────────────────────
const replitPlugins =
  !isProduction && isReplitEnv
    ? await Promise.all([
        import('@replit/vite-plugin-runtime-error-modal').then((m) => m.default()),
        import('@replit/vite-plugin-cartographer').then((m) =>
          m.cartographer({ root: path.resolve(import.meta.dirname, '..') }),
        ),
        import('@replit/vite-plugin-dev-banner').then((m) => m.devBanner()),
      ])
    : [];

// ──────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    ...replitPlugins,
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
