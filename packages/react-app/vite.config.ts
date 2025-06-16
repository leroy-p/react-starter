import path from 'path'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { ConfigEnv, defineConfig, loadEnv } from 'vite'

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '')

  return defineConfig({
    root: path.resolve(__dirname),
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    plugins: [react(), tsconfigPaths()],
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV),
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    server: {
      port: 8080,
    },
  })
}