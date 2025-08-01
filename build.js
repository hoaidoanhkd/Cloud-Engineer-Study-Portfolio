const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Copy main files
console.log('Copying main files...');
fs.copyFileSync('index.html', 'dist/index.html');
fs.copyFileSync('README.md', 'dist/README.md');

// Create quiz-parts directory in dist
if (!fs.existsSync('dist/quiz-parts')) {
    fs.mkdirSync('dist/quiz-parts');
}

// Copy all quiz part HTML files
console.log('Copying quiz parts...');
const quizFiles = fs.readdirSync('quiz-parts');
quizFiles.forEach(file => {
    if (file.endsWith('.html')) {
        const sourcePath = path.join('quiz-parts', file);
        const destPath = path.join('dist/quiz-parts', file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✓ Copied ${file}`);
    }
});

console.log('Build completed successfully!');