import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const workspaceRoot = path.resolve(__dirname, '../../')
const appRoot = path.resolve(__dirname)

export default defineConfig({
  root: appRoot,
  envDir: workspaceRoot,
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 8080,
  },
})
