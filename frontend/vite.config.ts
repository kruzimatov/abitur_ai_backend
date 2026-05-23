import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 1. Plaginni import qilamiz

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // 2. Plaginni shu yerga qo'shamiz
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
