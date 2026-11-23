import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function utf8PlainTextPlugin(): Plugin {
  const applyUtf8TxtHeader = (
    req: {url?: string},
    res: {setHeader: (name: string, value: string) => void},
    next: () => void,
  ) => {
    const reqPath = (req.url || '').split('?')[0];
    if (reqPath === '/llms.txt' || reqPath === '/llms-full.txt' || reqPath === '/robots.txt') {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    next();
  };

  return {
    name: 'utf8-plain-text-headers',
    configureServer(server) {
      server.middlewares.use(applyUtf8TxtHeader);
    },
    configurePreviewServer(server) {
      server.middlewares.use(applyUtf8TxtHeader);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      utf8PlainTextPlugin(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
