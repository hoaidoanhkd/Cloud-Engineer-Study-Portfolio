// Script to update all quiz files with enhanced answer feedback logic
const fs = require('fs');
const path = require('path');

// CSS styles to add to each quiz file
const enhancedCSS = `
    /* Enhanced answer feedback styles */
    .answers label.selected-correct {
        background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%) !important;
        border-color: var(--secondary-color) !important;
        color: var(--secondary-color) !important;
        transform: translateX(5px) !important;
        box-shadow: 0 4px 12px rgba(52, 168, 83, 0.2) !important;
    }
    
    .answers label.selected-correct::before {
        background: var(--secondary-color) !important;
    }
    
    .answers label.selected-incorrect {
        background: linear-gradient(135deg, #f8e8e8 0%, #f5d7d7 100%) !important;
        border-color: var(--danger-color) !important;
        color: var(--danger-color) !important;
        transform: translateX(5px) !important;
        box-shadow: 0 4px 12px rgba(234, 67, 53, 0.2) !important;
    }
    
    .answers label.selected-incorrect::before {
        background: var(--danger-color) !important;
    }
    
    .answers label.correct {
        background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%) !important;
        border-color: var(--secondary-color) !important;
        color: var(--secondary-color) !important;
        box-shadow: 0 4px 12px rgba(52, 168, 83, 0.2) !important;
    }
    
    .answers label.correct::before {
        background: var(--secondary-color) !important;
    }
    
    /* Disabled state for answered questions */
    .answers input[type="radio"]:disabled + label {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .answers input[type="radio"]:disabled + label:hover {
        transform: none;
        background: var(--bg-secondary);
        border-color: var(--border-color);
    }
`;

// Quiz files to update
const quizFiles = [
    'quiz-parts/part1-questions-1-50.html',
    'quiz-parts/part2-questions-51-100.html',
    'quiz-parts/part3-questions-101-150.html',
    'quiz-parts/part4-questions-151-200.html',
    'quiz-parts/part5-questions-201-250.html',
    'quiz-parts/part6-questions-251-302.html',
    'quiz-parts/difficult-questions-quiz.html'
];

function updateQuizFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add enhanced CSS if not already present
        if (!content.includes('.answers label.selected-correct')) {
            const cssInsertPoint = content.indexOf('.answers input[type="radio"]:checked + label.incorrect::before {');
            if (cssInsertPoint !== -1) {
                const endOfCSS = content.indexOf('}', cssInsertPoint) + 1;
                content = content.slice(0, endOfCSS) + enhancedCSS + content.slice(endOfCSS);
            }
        }
        
        // Update script to use window.correctAnswers
        if (content.includes('const correctAnswers =')) {
            content = content.replace('const correctAnswers =', 'window.correctAnswers =');
        }
        
        if (content.includes('initializeQuiz(correctAnswers,')) {
            content = content.replace('initializeQuiz(correctAnswers,', 'initializeQuiz(window.correctAnswers,');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${filePath}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

// Update all quiz files
console.log('🔄 Updating quiz files with enhanced answer feedback...');
quizFiles.forEach(updateQuizFile);
console.log('✅ All quiz files updated successfully!'); 