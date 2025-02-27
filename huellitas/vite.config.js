import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public'
});

/*
export default defineConfig({
  plugins: [react()],
  base: "./",
});npm run dev
*/