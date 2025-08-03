// Enhanced Quiz System with improved logic
class QuizManager {
    constructor() {
        this.quizData = null;
        this.currentPart = null;
        this.userAnswers = {};
        this.difficultQuestions = [];
        this.progress = {};
        this.init();
    }

    async init() {
        try {
            await this.loadQuizData();
            this.loadUserProgress();
            this.loadDifficultQuestions();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize quiz manager:', error);
            this.showNotification('Không thể tải dữ liệu quiz. Vui lòng tải lại trang.', 'error');
        }
    }

    async loadQuizData() {
        try {
            const response = await fetch('quiz-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.quizData = await response.json();
        } catch (error) {
            console.error('Error loading quiz data:', error);
            throw error;
        }
    }

    loadUserProgress() {
        try {
            const stored = localStorage.getItem('quizProgress');
            this.progress = stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading user progress:', error);
            this.progress = {};
        }
    }

    saveUserProgress() {
        try {
            localStorage.setItem('quizProgress', JSON.stringify(this.progress));
        } catch (error) {
            console.error('Error saving user progress:', error);
            this.showNotification('Không thể lưu tiến độ. Vui lòng kiểm tra quyền truy cập.', 'error');
        }
    }

    loadDifficultQuestions() {
        try {
            const stored = localStorage.getItem('difficultQuestions');
            this.difficultQuestions = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading difficult questions:', error);
            this.difficultQuestions = [];
        }
    }

    saveDifficultQuestions() {
        try {
            localStorage.setItem('difficultQuestions', JSON.stringify(this.difficultQuestions));
        } catch (error) {
            console.error('Error saving difficult questions:', error);
            this.showNotification('Không thể lưu câu hỏi khó. Vui lòng kiểm tra quyền truy cập.', 'error');
        }
    }

    setupEventListeners() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '4') {
                const activeQuestion = document.querySelector('.question:focus-within');
                if (activeQuestion) {
                    const radioButtons = activeQuestion.querySelectorAll('input[type="radio"]');
                    const index = parseInt(e.key) - 1;
                    if (radioButtons[index]) {
                        radioButtons[index].checked = true;
                        radioButtons[index].dispatchEvent(new Event('change'));
                    }
                }
            }
        });

        // Add accessibility improvements
        document.querySelectorAll('.question').forEach(question => {
            question.setAttribute('role', 'group');
            question.setAttribute('aria-labelledby', question.querySelector('p')?.id || '');
        });
    }

    initializeQuiz(partName, startNumber = 1) {
        if (!this.quizData || !this.quizData.quizParts[partName]) {
            console.error('Invalid quiz part or data not loaded');
            return;
        }

        this.currentPart = partName;
        const partData = this.quizData.quizParts[partName];
        const total = partData.total;
        const correctAnswers = partData.correctAnswers;

        // Add enhanced CSS
        this.addEnhancedStyles();

        // Add progress tracking
        this.addProgressBar(partName, startNumber, total);

        // Add question navigation
        this.addQuestionNavigation(total, startNumber);

        // Initialize questions with enhanced features
        this.initializeQuestions(total, correctAnswers, partName, startNumber);

        // Add stats bar
        this.addStatsBar(partName, startNumber, total);

        // Add difficult question buttons
        this.addDifficultButtons(total, partName, startNumber);

        // Update UI
        this.updateProgress(partName, startNumber, total);
        this.updateDifficultButtons(total, partName, startNumber);
    }

    addEnhancedStyles() {
        if (document.getElementById('enhanced-quiz-styles')) return;

        const style = document.createElement('style');
        style.id = 'enhanced-quiz-styles';
        style.textContent = `
            .progress-bar {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border: 1px solid #dee2e6;
                border-radius: 12px;
                padding: 20px;
                margin: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .progress-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            
            .progress-text {
                font-size: 14px;
                font-weight: 500;
                color: #495057;
            }
            
            .progress-percentage {
                font-size: 18px;
                font-weight: bold;
                color: #4285f4;
            }
            
            .progress-bar-container {
                width: 100%;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #4285f4, #34a853);
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 0%;
            }
            
            .question-navigation {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 12px;
                border: 1px solid #dee2e6;
            }
            
            .nav-button {
                padding: 8px 12px;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
                min-width: 40px;
                text-align: center;
            }
            
            .nav-button:hover {
                background: #4285f4;
                color: white;
                border-color: #4285f4;
            }
            
            .nav-button.answered {
                background: #34a853;
                color: white;
                border-color: #34a853;
            }
            
            .nav-button.current {
                background: #4285f4;
                color: white;
                border-color: #4285f4;
                font-weight: bold;
            }
            
            .question {
                scroll-margin-top: 100px;
            }
            
            .question:focus-within {
                border-color: #4285f4;
                box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
            }
            
            .answer-feedback {
                margin-top: 10px;
                padding: 10px;
                border-radius: 6px;
                font-size: 14px;
                display: none;
            }
            
            .answer-feedback.correct {
                background: rgba(76, 175, 80, 0.1);
                color: #2e7d32;
                border: 1px solid rgba(76, 175, 80, 0.3);
            }
            
            .answer-feedback.incorrect {
                background: rgba(244, 67, 54, 0.1);
                color: #c62828;
                border: 1px solid rgba(244, 67, 54, 0.3);
            }
            
            .keyboard-hint {
                font-size: 12px;
                color: #6c757d;
                margin-top: 10px;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .question-navigation {
                    justify-content: center;
                }
                
                .nav-button {
                    min-width: 35px;
                    padding: 6px 8px;
                    font-size: 11px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addProgressBar(partName, startNumber, total) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-content">
                <span class="progress-text">Tiến độ: <span class="progress-count">0</span>/${total} câu hỏi</span>
                <span class="progress-percentage">0%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill"></div>
            </div>
        `;

        const container = document.querySelector('.container, body');
        if (container) {
            const firstChild = container.firstElementChild;
            if (firstChild) {
                container.insertBefore(progressBar, firstChild);
            } else {
                container.appendChild(progressBar);
            }
        }
    }

    addQuestionNavigation(total, startNumber) {
        const navigation = document.createElement('div');
        navigation.className = 'question-navigation';
        
        const buttons = [];
        for (let i = 1; i <= total; i++) {
            const button = document.createElement('button');
            button.className = 'nav-button';
            button.textContent = startNumber + i - 1;
            button.setAttribute('data-question', i);
            button.addEventListener('click', () => {
                this.scrollToQuestion(startNumber + i - 1);
            });
            buttons.push(button);
        }
        
        navigation.append(...buttons);
        
        const container = document.querySelector('.container, body');
        if (container) {
            const progressBar = container.querySelector('.progress-bar');
            if (progressBar) {
                container.insertBefore(navigation, progressBar.nextSibling);
            } else {
                container.insertBefore(navigation, container.firstElementChild);
            }
        }
    }

    initializeQuestions(total, correctAnswers, partName, startNumber) {
        for (let i = 1; i <= total; i++) {
            const questionNumber = startNumber + i - 1;
            const radios = document.getElementsByName(`q${i}`);
            
            if (radios.length === 0) {
                console.warn(`No radio buttons found for question ${i}`);
                continue;
            }

            // Add answer feedback element
            const questionElement = document.getElementById(`question${questionNumber}`);
            if (questionElement) {
                const feedback = document.createElement('div');
                feedback.className = 'answer-feedback';
                feedback.id = `feedback${questionNumber}`;
                questionElement.appendChild(feedback);
            }

            radios.forEach((radio, index) => {
                radio.addEventListener('change', (event) => {
                    this.handleAnswerSelection(i, questionNumber, radio, correctAnswers, partName, event);
                });

                // Add keyboard accessibility
                radio.setAttribute('aria-label', `Option ${String.fromCharCode(65 + index)}`);
            });

            // Add keyboard hint
            const questionDiv = document.querySelector(`#question${questionNumber}`);
            if (questionDiv && !questionDiv.querySelector('.keyboard-hint')) {
                const hint = document.createElement('div');
                hint.className = 'keyboard-hint';
                hint.textContent = '💡 Tip: Nhấn phím 1-4 để chọn đáp án A-D';
                questionDiv.appendChild(hint);
            }
        }
    }

    handleAnswerSelection(questionIndex, questionNumber, selectedRadio, correctAnswers, partName, event) {
        const correctAnswer = correctAnswers[questionIndex - 1];
        const isCorrect = selectedRadio.value === correctAnswer;

        // Update user answers
        this.userAnswers[questionNumber] = {
            answer: selectedRadio.value,
            correct: isCorrect,
            timestamp: new Date().toISOString()
        };

        // Save progress
        this.saveUserProgress();

        // Update UI
        this.updateAnswerDisplay(questionNumber, selectedRadio, correctAnswer, isCorrect);
        this.updateProgress(partName, this.quizData.quizParts[partName].startNumber, this.quizData.quizParts[partName].total);
        this.updateNavigation(questionIndex);

        // Show feedback
        this.showAnswerFeedback(questionNumber, isCorrect, correctAnswer);
    }

    updateAnswerDisplay(questionNumber, selectedRadio, correctAnswer, isCorrect) {
        const questionElement = document.getElementById(`question${questionNumber}`);
        if (!questionElement) return;

        const radios = questionElement.querySelectorAll('input[type="radio"]');
        const labels = questionElement.querySelectorAll('label');

        // Reset all labels
        labels.forEach(label => {
            label.style.fontWeight = "normal";
            label.style.color = "black";
            label.style.backgroundColor = "transparent";
        });

        // Highlight selected answer
        const selectedLabel = selectedRadio.parentElement;
        if (selectedLabel) {
            if (isCorrect) {
                selectedLabel.style.color = "green";
                selectedLabel.style.fontWeight = "bold";
                selectedLabel.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
            } else {
                selectedLabel.style.color = "red";
                selectedLabel.style.fontWeight = "bold";
                selectedLabel.style.backgroundColor = "rgba(244, 67, 54, 0.1)";

                // Highlight correct answer
                radios.forEach(radio => {
                    if (radio.value === correctAnswer) {
                        const correctLabel = radio.parentElement;
                        if (correctLabel) {
                            correctLabel.style.color = "green";
                            correctLabel.style.fontWeight = "bold";
                            correctLabel.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
                        }
                    }
                });
            }
        }
    }

    showAnswerFeedback(questionNumber, isCorrect, correctAnswer) {
        const feedback = document.getElementById(`feedback${questionNumber}`);
        if (!feedback) return;

        feedback.className = `answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.style.display = 'block';

        if (isCorrect) {
            feedback.innerHTML = '✅ <strong>Chính xác!</strong> Bạn đã trả lời đúng.';
        } else {
            feedback.innerHTML = `❌ <strong>Sai rồi!</strong> Đáp án đúng là: <strong>${correctAnswer}</strong>`;
        }

        // Auto-hide after 3 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    }

    updateProgress(partName, startNumber, total) {
        const answeredCount = Object.keys(this.userAnswers).filter(key => {
            const num = parseInt(key);
            return num >= startNumber && num < startNumber + total;
        }).length;

        const percentage = Math.round((answeredCount / total) * 100);

        const progressCount = document.querySelector('.progress-count');
        const progressPercentage = document.querySelector('.progress-percentage');
        const progressBarFill = document.querySelector('.progress-bar-fill');

        if (progressCount) progressCount.textContent = answeredCount;
        if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
        if (progressBarFill) progressBarFill.style.width = `${percentage}%`;
    }

    updateNavigation(questionIndex) {
        const navButton = document.querySelector(`[data-question="${questionIndex}"]`);
        if (navButton) {
            navButton.classList.add('answered');
        }
    }

    scrollToQuestion(questionNumber) {
        const questionElement = document.getElementById(`question${questionNumber}`);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            questionElement.focus();
        }
    }

    addStatsBar(partName, startNumber, total) {
        const statsBar = document.createElement('div');
        statsBar.className = 'part-stats-bar';
        statsBar.innerHTML = `
            <div class="part-stats-content">
                <span class="stats-icon">📊</span>
                <span class="stats-text">Câu khó trong phần này: </span>
                <span class="stats-number" id="partStatsNumber">0</span>
                <span class="stats-total">/${total}</span>
            </div>
        `;

        const container = document.querySelector('.container, body');
        if (container) {
            const firstChild = container.firstElementChild;
            if (firstChild) {
                container.insertBefore(statsBar, firstChild);
            } else {
                container.appendChild(statsBar);
            }
        }
    }

    addDifficultButtons(total, partName, startNumber) {
        for (let i = 1; i <= total; i++) {
            const actualQuestionNumber = startNumber + i - 1;
            const questionDiv = document.querySelector(`#question${actualQuestionNumber}`);
            
            if (questionDiv && !questionDiv.querySelector('.difficult-btn')) {
                const questionP = questionDiv.querySelector('p');
                if (questionP) {
                    const header = document.createElement('div');
                    header.className = 'question-header';
                    
                    const content = document.createElement('div');
                    content.className = 'question-content';
                    content.appendChild(questionP.cloneNode(true));
                    
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'difficult-btn';
                    button.textContent = '⭐ ';
                    button.setAttribute('data-question', actualQuestionNumber);
                    button.setAttribute('data-source', partName);
                    button.setAttribute('aria-label', 'Đánh dấu câu hỏi khó');
                    
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.toggleDifficultQuestion(actualQuestionNumber, partName, event);
                    });
                    
                    header.appendChild(content);
                    header.appendChild(button);
                    
                    questionDiv.replaceChild(header, questionP);
                }
            }
        }
    }

    toggleDifficultQuestion(questionNumber, source, event) {
        const currentScrollY = window.scrollY;
        
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const questionId = `q${questionNumber}_${source}`;
        const existingIndex = this.difficultQuestions.findIndex(q => q.id === questionId);
        
        const questionElement = document.getElementById(`question${questionNumber}`);
        if (!questionElement) {
            console.error(`Question element with id 'question${questionNumber}' not found`);
            return false;
        }
        
        const questionTextElement = questionElement.querySelector('.question-content p, p');
        if (!questionTextElement) {
            console.error(`Question text element not found for question ${questionNumber}`);
            return false;
        }
        
        const questionText = questionTextElement.textContent.trim();
        const button = questionElement.querySelector('.difficult-btn');
        
        // Get answers
        const answers = [];
        const answerElements = questionElement.querySelectorAll('.answers label');
        answerElements.forEach((label, index) => {
            const input = label.querySelector('input');
            let answerText = label.textContent.trim();
            
            if (answerText) {
                const labelPattern = /^[A-D]\.\s*/;
                answerText = answerText.replace(labelPattern, '');
                
                const duplicatePattern = /^([A-D])\.\s*\1\.\s*/;
                if (duplicatePattern.test(answerText)) {
                    answerText = answerText.replace(duplicatePattern, '$1. ');
                }
                
                answers.push(answerText);
            }
        });
        
        if (existingIndex > -1) {
            // Remove from difficult questions
            this.difficultQuestions.splice(existingIndex, 1);
            button.textContent = '⭐ ';
            button.classList.remove('marked');
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        } else {
            // Add to difficult questions
            this.difficultQuestions.push({
                id: questionId,
                questionNumber: questionNumber,
                text: questionText,
                answers: answers,
                source: source,
                timestamp: new Date().toISOString()
            });
            button.textContent = '🔥';
            button.classList.add('marked');
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1.05)';
            }, 150);
        }
        
        this.saveDifficultQuestions();
        this.updateDifficultButtons(this.quizData.quizParts[source].total, source, this.quizData.quizParts[source].startNumber);
        
        // Restore scroll position
        setTimeout(() => {
            window.scrollTo(0, currentScrollY);
        }, 0);
        
        return false;
    }

    updateDifficultButtons(total, partName, startNumber) {
        for (let i = 1; i <= total; i++) {
            const actualQuestionNumber = startNumber + i - 1;
            const questionId = `q${actualQuestionNumber}_${partName}`;
            const button = document.querySelector(`#question${actualQuestionNumber} .difficult-btn`);
            if (button && this.difficultQuestions.some(q => q.id === questionId)) {
                button.textContent = '🔥';
                button.classList.add('marked');
            }
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        let background, icon;
        switch(type) {
            case 'success':
                background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                icon = '✅';
                break;
            case 'error':
                background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                icon = '❌';
                break;
            case 'warning':
                background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                icon = '⚠️';
                break;
            default:
                background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
                icon = 'ℹ️';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${background};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: bold;
            font-size: 14px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            max-width: 300px;
            word-wrap: break-word;
            animation: bounceIn 0.5s ease;
        `;
        
        notification.innerHTML = `${icon} ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'all 0.3s ease';
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }

    // Get statistics
    getStatistics() {
        const totalAnswered = Object.keys(this.userAnswers).length;
        const correctAnswers = Object.values(this.userAnswers).filter(answer => answer.correct).length;
        const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
        
        return {
            totalAnswered,
            correctAnswers,
            accuracy,
            difficultQuestionsCount: this.difficultQuestions.length
        };
    }

    // Export progress
    exportProgress() {
        const data = {
            userAnswers: this.userAnswers,
            difficultQuestions: this.difficultQuestions,
            statistics: this.getStatistics(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import progress
    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.userAnswers) this.userAnswers = data.userAnswers;
                if (data.difficultQuestions) this.difficultQuestions = data.difficultQuestions;
                
                this.saveUserProgress();
                this.saveDifficultQuestions();
                
                this.showNotification('Đã import tiến độ thành công!', 'success');
                location.reload();
            } catch (error) {
                console.error('Error importing progress:', error);
                this.showNotification('Không thể import file. Vui lòng kiểm tra định dạng.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the enhanced quiz manager
const quizManager = new QuizManager();

// Legacy function for backward compatibility
function initializeQuiz(correctAnswers, total, partName, startNumber = 1) {
    quizManager.initializeQuiz(partName, startNumber);
} 