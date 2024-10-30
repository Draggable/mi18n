import path from 'path'
import { defineConfig } from 'vite'
import banner from 'vite-plugin-banner'
import compression from 'vite-plugin-compression'

const pkg = require('./package.json')

const bannerTemplate = `
/**
${pkg.name} - ${pkg.homepage}
Version: ${pkg.version}
Author: ${pkg.author}
*/
`

export default defineConfig({
  plugins: [
    banner(bannerTemplate),
    compression({
      algorithm: 'gzip',
      minRatio: 0.8,
      ext: '.gz',
      threshold: 10240,
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/mi18n.js',
      name: 'i18n',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: format => `i18n.${format}.min.js`,
      outDir: 'dist',
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        banner: bannerTemplate,
      },
    },
    sourcemap: process.env.NODE_ENV === 'production' ? 'inline' : false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json'],
  },
  server: {
    open: true,
    port: 3000,
    strictPort: true,
  },
})
