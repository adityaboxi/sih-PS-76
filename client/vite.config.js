import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env dynamically
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.VITE_PORT || '5173', 10);
  const proxyTarget = env.VITE_API_PROXY_TARGET || env.VITE_SERVER_URL || 'http://localhost:3000';

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      port,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true
        }
      }
    }
  };
});
