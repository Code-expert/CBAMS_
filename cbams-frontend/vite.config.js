import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
  preview: {
    allowedHosts: ['cbams-1.onrender.com', 'localhost'],
    host: '0.0.0.0',
    port: process.env.PORT || 10000,
  }

})
