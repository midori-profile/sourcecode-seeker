import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.base ?? '';

const outDir = (() => {
  if (base.includes('popup')) {
    return 'popup';
  }
  return 'dist';
})();

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
      jsxRuntime: 'classic',
    }),
  ],
  server: {
    port: 4444,
    open: true,
  },
  build: {
    outDir,
  },
});
