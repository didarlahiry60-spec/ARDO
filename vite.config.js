import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ardoApiPlugin } from './server/apiMiddleware.js'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  const base = isProd ? '/ARDO/' : '/';

  return {
    base,
    plugins: [
      react(),
      ardoApiPlugin(),
      {
        name: 'image-base-prefix',
        transform(code, id) {
          if (isProd && (id.endsWith('.jsx') || id.endsWith('.js'))) {
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
