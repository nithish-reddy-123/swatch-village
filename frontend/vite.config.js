import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0", // REQUIRED for Render
        port: process.env.PORT || 5173, // ALWAYS USE process.env.PORT
        proxy: {
            '/api': {
                target: 'https://swatch-village.onrender.com',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    preview: {
        host: "0.0.0.0",
        port: process.env.PORT || 5173, // SAME FOR PREVIEW
    },
})
