import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    test: {
        globals: true,
        environment: 'jsdom',
        testNamePattern: './tests/**/*.test.tsx',
        setupFiles: './testSetup.ts',
    },
    css: {
        postcss: {
            plugins: [tailwindcss],
        },
    },
})
