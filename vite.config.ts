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
        main: resolve(__dirname, 'quiz-parts/index.html'),
        instructions: resolve(__dirname, 'index.html'),
        difficult: resolve(__dirname, 'difficult-questions.html'),
        difficultQuiz: resolve(__dirname, 'quiz-parts/difficult-questions-quiz.html')
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
      name: 'copy-additional-files',
      writeBundle() {
        const distDir = resolve(__dirname, 'dist');
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true });
        }
        
        // Copy quiz-common.js to dist root
        const commonJsSource = resolve(__dirname, 'quiz-common.js');
        const commonJsTarget = resolve(distDir, 'quiz-common.js');
        if (existsSync(commonJsSource)) {
          copyFileSync(commonJsSource, commonJsTarget);
          console.log('✓ Copied quiz-common.js to dist/');
        }
        
        // Copy quiz-parts directory to dist
        const quizPartsSourceDir = resolve(__dirname, 'quiz-parts');
        const quizPartsTargetDir = resolve(__dirname, 'dist/quiz-parts');
        if (existsSync(quizPartsSourceDir)) {
          if (!existsSync(quizPartsTargetDir)) {
            mkdirSync(quizPartsTargetDir, { recursive: true });
          }
          
          const files = readdirSync(quizPartsSourceDir);
          files.forEach(file => {
            if (file.endsWith('.html') || file.endsWith('.md')) {
              copyFileSync(
                resolve(quizPartsSourceDir, file),
                resolve(quizPartsTargetDir, file)
              );
            }
          });
          console.log('✓ Copied quiz-parts HTML/MD to dist/quiz-parts/');
        }
      }
    }
  ]
});