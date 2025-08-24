// Script to update all HTML files for dark mode support
// This script can be run to automatically add dark mode to all quiz pages

const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
    'part2-questions-51-100.html',
    'part3-questions-101-150.html',
    'part4-questions-151-200.html',
    'part5-questions-201-250.html',
    'part6-questions-251-317.html',
    'keyword_251_317.html',
    'custom-quiz.html',
    'exam-simulation.html',
    'real-exam-simulation.html',
    'fisher-yates-demo.html',
    'test-syntax.html'
];

function updateHtmlFile(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        let updated = false;

        // Add dark mode CSS link if not present
        if (!content.includes('dark-mode.css')) {
            content = content.replace(
                /<title>([^<]+)<\/title>/,
                '<title>$1</title>\n    <link rel="stylesheet" href="dark-mode.css">'
            );
            updated = true;
        }

        // Update body background to use CSS variables
        if (content.includes('background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)')) {
            content = content.replace(
                /background: linear-gradient\(135deg, #667eea 0%, #764ba2 100%\);/g,
                'background: var(--gradient-primary);'
            );
            updated = true;
        }

        // Add color variable to body if not present
        if (!content.includes('color: var(--text-primary)')) {
            content = content.replace(
                /(body\s*\{[^}]*background:[^}]*)(\})/g,
                '$1; color: var(--text-primary);$2'
            );
            updated = true;
        }

        // Update container background
        if (content.includes('background: white;')) {
            content = content.replace(/background: white;/g, 'background: var(--bg-primary);');
            updated = true;
        }

        // Update header gradient
        if (content.includes('background: linear-gradient(135deg, #4285f4 0%, #34a853 100%)')) {
            content = content.replace(
                /background: linear-gradient\(135deg, #4285f4 0%, #34a853 100%\);/g,
                'background: var(--gradient-header);'
            );
            updated = true;
        }

        // Update question backgrounds
        if (content.includes('background: linear-gradient(145deg, #ffffff, #f8f9fa)')) {
            content = content.replace(
                /background: linear-gradient\(145deg, #ffffff, #f8f9fa\);/g,
                'background: var(--card-bg);'
            );
            updated = true;
        }

        // Update question borders
        if (content.includes('border: 2px solid #e9ecef;')) {
            content = content.replace(/border: 2px solid #e9ecef;/g, 'border: 2px solid var(--border-color);');
            updated = true;
        }

        // Update answers background
        if (content.includes('background: linear-gradient(145deg, #f8f9fa, #ffffff)')) {
            content = content.replace(
                /background: linear-gradient\(145deg, #f8f9fa, #ffffff\);/g,
                'background: var(--bg-secondary);'
            );
            updated = true;
        }

        // Update answers border
        if (content.includes('border: 1px solid #e9ecef;')) {
            content = content.replace(/border: 1px solid #e9ecef;/g, 'border: 1px solid var(--border-color);');
            updated = true;
        }

        // Update label borders
        if (content.includes('border: 2px solid #e9ecef;')) {
            content = content.replace(/border: 2px solid #e9ecef;/g, 'border: 2px solid var(--border-color);');
            updated = true;
        }

        // Add dark mode script if not present
        if (!content.includes('dark-mode.js')) {
            content = content.replace(
                /(<script[^>]*quiz-common\.js[^>]*><\/script>)/,
                '$1\n    <script src="dark-mode.js"></script>'
            );
            updated = true;
        }

        if (updated) {
            fs.writeFileSync(filename, content, 'utf8');
            console.log(`✅ Updated ${filename}`);
        } else {
            console.log(`⏭️  No changes needed for ${filename}`);
        }

    } catch (error) {
        console.error(`❌ Error updating ${filename}:`, error.message);
    }
}

// Update all files
console.log('🔄 Starting dark mode updates...\n');

htmlFiles.forEach(filename => {
    if (fs.existsSync(filename)) {
        updateHtmlFile(filename);
    } else {
        console.log(`⚠️  File not found: ${filename}`);
    }
});

console.log('\n✨ Dark mode update complete!');
console.log('\n📝 Manual steps you may need to do:');
console.log('1. Check each file to ensure dark mode styles are applied correctly');
console.log('2. Test the dark mode toggle on each page');
console.log('3. Verify that all elements are properly styled in both light and dark modes');
