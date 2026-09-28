import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Output directory consumed by Vercel (auto-detected framework preset)
  build: {
    outDir: 'dist',
  },
})
