import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mvp3/', // ←ここを修正！
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
