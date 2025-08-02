const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy all HTML files to dist directory
const files = fs.readdirSync('.');
files.forEach(file => {
    if (file.endsWith('.html')) {
        const sourcePath = path.join('.', file);
        const destPath = path.join(distDir, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to dist/`);
    }
});

console.log('Build completed successfully!'); 