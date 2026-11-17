import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ardoApiPlugin } from './server/apiMiddleware.js'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  // Cloudflare Pages automatically injects CF_PAGES=1 during build
  const isCloudflare = process.env.CF_PAGES === '1' || process.env.DEPLOY_PLATFORM === 'cloudflare';
  const isGhPages = !isCloudflare && (process.env.DEPLOY_PLATFORM === 'gh-pages' || isProd);
  const base = isCloudflare ? '/' : (isGhPages ? '/ARDO/' : '/');

  return {
    base,
    plugins: [
      react(),
      ardoApiPlugin(),
      {
        name: 'image-base-prefix',
        transform(code, id) {
          if (isGhPages && !isCloudflare && (id.endsWith('.jsx') || id.endsWith('.js'))) {
            return code.replace(/(['"`])\/images\//g, `$1/ARDO/images/`);
          }
        }
      }
    ],
    server: {
      port: 5173,
      host: true
    }
  };
});
