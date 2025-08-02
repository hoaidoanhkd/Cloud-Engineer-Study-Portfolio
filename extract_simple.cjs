const fs = require('fs');
const path = require('path');

function extractQuestions() {
    const allQuestions = [];
    
    // Map parts to their question ranges
    const parts = {
        1: "1-50",
        2: "51-100", 
        3: "101-150",
        4: "151-200",
        5: "201-250",
        6: "251-302"
    };
    
    for (const [partNum, rangeStr] of Object.entries(parts)) {
        const filePath = `quiz-parts/part${partNum}-questions-${rangeStr}.html`;
        
        if (!fs.existsSync(filePath)) {
            continue;
        }
        
        console.log(`Processing ${filePath}...`);
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract questions using regex
        const questionRegex = /<div class="question" id="question(\d+)">([\s\S]*?)(?=<div class="question"|<\/form>)/g;
        let match;
        
        while ((match = questionRegex.exec(content)) !== null) {
            const questionNum = parseInt(match[1]);
            const questionContent = match[2];
            
            // Extract question text
            const textMatch = /<div class="question-content">[\s\S]*?<p>([\s\S]*?)<\/p>/i.exec(questionContent);
            if (!textMatch) continue;
            
            const questionText = textMatch[1]
                .replace(/<[^>]*>/g, '')
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .trim();
            
            // Extract options
            const options = [];
            const optionRegex = /<input[^>]*type="radio"[^>]*value="([A-D])"[^>]*>([^<]*(?:<[^>]*>[^<]*)*?)(?=<input|<\/div>)/g;
            let optionMatch;
            
            while ((optionMatch = optionRegex.exec(questionContent)) !== null) {
                const optionValue = optionMatch[1];
                let optionText = optionMatch[2]
                    .replace(/<[^>]*>/g, '')
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .trim();
                
                // Clean up option text
                optionText = optionText.replace(/^\s*-\s*/, '').trim();
                
                if (optionText) {
                    options.push({
                        id: optionValue,
                        text: optionText,
                        isCorrect: false
                    });
                }
            }
            
            if (questionText && options.length > 0) {
                const questionObj = {
                    id: `q${questionNum}`,
                    questionNumber: questionNum,
                    text: questionText,
                    options: options,
                    correctAnswer: "",
                    explanation: "",
                    category: "GCP",
                    difficulty: "medium",
                    source: `part${partNum}`
                };
                
                allQuestions.push(questionObj);
            }
        }
    }
    
    // Sort by question number
    allQuestions.sort((a, b) => a.questionNumber - b.questionNumber);
    
    console.log(`Extracted ${allQuestions.length} questions`);
    
    // Create src/data directory if it doesn't exist
    if (!fs.existsSync('src/data')) {
        fs.mkdirSync('src/data', { recursive: true });
    }
    
    // Save to JSON file
    fs.writeFileSync('src/data/questions.json', JSON.stringify(allQuestions, null, 2));
    
    console.log("Questions saved to src/data/questions.json");
    return allQuestions;
}

// Run the extraction
const questions = extractQuestions();

// Create a sample of first 3 questions for verification
const sample = questions.slice(0, 3);
console.log("\nSample questions:");
console.log(JSON.stringify(sample, null, 2));