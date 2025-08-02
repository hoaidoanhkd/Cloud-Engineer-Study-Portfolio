import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    sourcemap: true,
    minify: 'terser',
    target: 'es2020'
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  },
  plugins: [
    {
      name: 'copy-quiz-parts',
      writeBundle() {
        // Copy quiz-parts directory to dist
        const sourceDir = resolve(__dirname, 'quiz-parts');
        const targetDir = resolve(__dirname, 'dist/quiz-parts');
        
        if (existsSync(sourceDir)) {
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
          }
          
          const files = readdirSync(sourceDir);
          files.forEach(file => {
            if (file.endsWith('.html') || file.endsWith('.md')) {
              copyFileSync(
                resolve(sourceDir, file),
                resolve(targetDir, file)
              );
            }
          });
          console.log('✓ Copied quiz-parts to dist/');
        }
      }
    }
  ]
});