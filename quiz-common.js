// ========================================
// GCP QUIZ - ENHANCED BUSINESS LOGIC
// ========================================

// Constants
const STORAGE_KEYS = {
    DIFFICULT_QUESTIONS: 'difficultQuestions',
    QUIZ_PROGRESS: 'quizProgress',
    USER_STATS: 'userStats',
    SETTINGS: 'quizSettings'
};

const QUIZ_SETTINGS = {
    AUTO_SAVE: true,
    SHOW_HINTS: true,
    TIMER_ENABLED: false,
    DIFFICULTY_LEVEL: 'medium'
};

// Enhanced Data Management
class QuizDataManager {
    static getDifficultQuestions() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.DIFFICULT_QUESTIONS);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading difficult questions:', error);
            return [];
        }
    }

    static saveDifficultQuestions(questions) {
        try {
            localStorage.setItem(STORAGE_KEYS.DIFFICULT_QUESTIONS, JSON.stringify(questions));
            return true;
        } catch (error) {
            console.error('Error saving difficult questions:', error);
            showNotification('Không thể lưu dữ liệu. Vui lòng kiểm tra quyền truy cập.', 'error');
            return false;
        }
    }

    static getUserStats() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
            return stored ? JSON.parse(stored) : {
                totalQuestions: 0,
                correctAnswers: 0,
                difficultQuestions: 0,
                studyTime: 0,
                lastStudyDate: null,
                partProgress: {}
            };
        } catch (error) {
            console.error('Error reading user stats:', error);
            return {
                totalQuestions: 0,
                correctAnswers: 0,
                difficultQuestions: 0,
                studyTime: 0,
                lastStudyDate: null,
                partProgress: {}
            };
        }
    }

    static saveUserStats(stats) {
        try {
            localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
            return true;
        } catch (error) {
            console.error('Error saving user stats:', error);
            return false;
        }
    }

    static getQuizProgress(partName) {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
            const progress = stored ? JSON.parse(stored) : {};
            return progress[partName] || {
                answered: [],
                correct: [],
                incorrect: [],
                timeSpent: 0,
                lastAttempt: null
            };
        } catch (error) {
            console.error('Error reading quiz progress:', error);
            return {
                answered: [],
                correct: [],
                incorrect: [],
                timeSpent: 0,
                lastAttempt: null
            };
        }
    }

    static saveQuizProgress(partName, progress) {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
            const allProgress = stored ? JSON.parse(stored) : {};
            allProgress[partName] = progress;
            localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(allProgress));
            return true;
        } catch (error) {
            console.error('Error saving quiz progress:', error);
            return false;
        }
    }
}

// Enhanced Question Management
class QuestionManager {
    static toggleDifficultQuestion(questionNumber, source, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const questions = QuizDataManager.getDifficultQuestions();
        const questionId = `q${questionNumber}_${source}`;
        const existingIndex = questions.findIndex(q => q.id === questionId);
        
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
        
        // Enhanced answer extraction with better error handling
        const answerLabels = questionElement.querySelectorAll('.answers label');
        const answers = [];
        answerLabels.forEach((label, index) => {
            const answerText = label.textContent.trim();
            if (answerText) {
                answers.push(answerText);
            }
        });
        
        if (existingIndex > -1) {
            // Remove difficult question
            questions.splice(existingIndex, 1);
            button.innerHTML = '⭐';
            button.classList.remove('marked');
            button.title = 'Đánh dấu câu khó';
            showNotification('Đã bỏ đánh dấu câu khó!', 'info');
        } else {
            // Add difficult question with enhanced data
            questions.push({
                id: questionId,
                questionNumber: questionNumber,
                text: questionText,
                answers: answers,
                source: source,
                timestamp: new Date().toISOString(),
                difficulty: this.assessDifficulty(questionText, answers),
                tags: this.extractTags(questionText),
                attempts: 0,
                lastAttempt: null
            });
            button.innerHTML = '🔥';
            button.classList.add('marked');
            button.title = 'Bỏ đánh dấu câu khó';
            showNotification('Đã đánh dấu câu khó!', 'success');
        }
        
        const saved = QuizDataManager.saveDifficultQuestions(questions);
        if (saved) {
            this.updateStats();
            this.updateDifficultButtons();
        }
        
        return false;
    }

    static assessDifficulty(questionText, answers) {
        // Simple difficulty assessment based on question length and complexity
        const wordCount = questionText.split(' ').length;
        const hasTechnicalTerms = /(API|SDK|CLI|IAM|VPC|GKE|Cloud|Compute|Storage|Network)/i.test(questionText);
        
        if (wordCount > 50 || hasTechnicalTerms) return 'hard';
        if (wordCount > 30) return 'medium';
        return 'easy';
    }

    static extractTags(questionText) {
        // Extract relevant tags from question text
        const tags = [];
        const technicalTerms = ['API', 'SDK', 'CLI', 'IAM', 'VPC', 'GKE', 'Cloud', 'Compute', 'Storage', 'Network', 'Security', 'Database'];
        
        technicalTerms.forEach(term => {
            if (questionText.toLowerCase().includes(term.toLowerCase())) {
                tags.push(term);
            }
        });
        
        return tags;
    }

    static updateStats() {
        const questions = QuizDataManager.getDifficultQuestions();
        const stats = QuizDataManager.getUserStats();
        
        stats.difficultQuestions = questions.length;
        stats.lastStudyDate = new Date().toISOString();
        
        QuizDataManager.saveUserStats(stats);
        
        // Update UI elements
        const difficultCountElements = document.querySelectorAll('[id*="difficultCount"], [id*="DifficultCount"]');
        difficultCountElements.forEach(element => {
            element.textContent = questions.length;
        });
    }

    static updateDifficultButtons() {
        const questions = QuizDataManager.getDifficultQuestions();
        const buttons = document.querySelectorAll('.difficult-btn');
        
        buttons.forEach(button => {
            const questionElement = button.closest('[id^="question"]');
            if (questionElement) {
                const questionNumber = questionElement.id.replace('question', '');
                const source = this.getCurrentPartName();
                const questionId = `q${questionNumber}_${source}`;
                const isMarked = questions.some(q => q.id === questionId);
                
                if (isMarked) {
                    button.innerHTML = '🔥';
                    button.classList.add('marked');
                    button.title = 'Bỏ đánh dấu câu khó';
                } else {
                    button.innerHTML = '⭐';
                    button.classList.remove('marked');
                    button.title = 'Đánh dấu câu khó';
                }
            }
        });
    }

    static getCurrentPartName() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('part1')) return 'Part 1';
        if (currentUrl.includes('part2')) return 'Part 2';
        if (currentUrl.includes('part3')) return 'Part 3';
        if (currentUrl.includes('part4')) return 'Part 4';
        if (currentUrl.includes('part5')) return 'Part 5';
        if (currentUrl.includes('part6')) return 'Part 6';
        return 'Unknown Part';
    }
}

// Enhanced Progress Tracking
class ProgressTracker {
    static startSession() {
        this.sessionStartTime = Date.now();
        this.currentPart = QuestionManager.getCurrentPartName();
    }

    static endSession() {
        if (this.sessionStartTime) {
            const sessionDuration = Date.now() - this.sessionStartTime;
            const stats = QuizDataManager.getUserStats();
            stats.studyTime += sessionDuration;
            QuizDataManager.saveUserStats(stats);
        }
    }

    static recordAnswer(questionNumber, isCorrect, timeSpent = 0) {
        const partName = QuestionManager.getCurrentPartName();
        const progress = QuizDataManager.getQuizProgress(partName);
        
        progress.answered.push(questionNumber);
        if (isCorrect) {
            progress.correct.push(questionNumber);
        } else {
            progress.incorrect.push(questionNumber);
        }
        
        progress.timeSpent += timeSpent;
        progress.lastAttempt = new Date().toISOString();
        
        QuizDataManager.saveQuizProgress(partName, progress);
        
        // Update global stats
        const stats = QuizDataManager.getUserStats();
        stats.totalQuestions++;
        if (isCorrect) stats.correctAnswers++;
        QuizDataManager.saveUserStats(stats);
    }

    static getProgressSummary(partName) {
        const progress = QuizDataManager.getQuizProgress(partName);
        const total = progress.answered.length;
        const correct = progress.correct.length;
        const accuracy = total > 0 ? (correct / total * 100).toFixed(1) : 0;
        
        return {
            total,
            correct,
            incorrect: progress.incorrect.length,
            accuracy: parseFloat(accuracy),
            timeSpent: progress.timeSpent,
            lastAttempt: progress.lastAttempt
        };
    }
}

// Enhanced UI Components
class UIComponents {
    static showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        let background;
        switch(type) {
            case 'success':
                background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                break;
            case 'error':
                background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                break;
            case 'warning':
                background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                break;
            default:
                background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
        }
        
        notification.style.background = background;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    static createProgressBar(container, progress) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            width: ${progress}%;
            transition: width 0.3s ease;
        `;
        
        progressBar.appendChild(progressFill);
        container.appendChild(progressBar);
        
        return progressBar;
    }

    static createStatsCard(title, value, subtitle = '', icon = '📊') {
        const card = document.createElement('div');
        card.className = 'stats-card';
        card.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        `;
        
        card.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">${icon}</div>
            <div style="font-size: 2rem; font-weight: bold; color: #4285f4; margin-bottom: 5px;">${value}</div>
            <div style="font-size: 1rem; color: #5f6368; margin-bottom: 5px;">${title}</div>
            ${subtitle ? `<div style="font-size: 0.9rem; color: #9aa0a6;">${subtitle}</div>` : ''}
        `;
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        return card;
    }
}

// Enhanced Quiz Initialization
class QuizInitializer {
    static initializeQuiz(correctAnswers, total, partName, startNumber = 1) {
        ProgressTracker.startSession();
        
        // Initialize progress tracking
        const progress = QuizDataManager.getQuizProgress(partName);
        const answeredCount = progress.answered.length;
        const correctCount = progress.correct.length;
        
        // Add enhanced stats display
        this.addEnhancedStats(partName, startNumber, total, answeredCount, correctCount);
        
        // Add difficult buttons with enhanced functionality
        this.addEnhancedDifficultButtons(total, partName, startNumber);
        
        // Add progress tracking to radio buttons
        this.addProgressTracking(total, partName, startNumber);
        
        // Initialize UI components
        this.initializeUIComponents();
        
        // Update all displays
        this.updateAllDisplays(partName, startNumber, total);
    }

    static addEnhancedStats(partName, startNumber, total, answeredCount, correctCount) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'enhanced-stats';
        statsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%);
            border-radius: 12px;
        `;
        
        const progress = ((answeredCount / total) * 100).toFixed(1);
        const accuracy = answeredCount > 0 ? ((correctCount / answeredCount) * 100).toFixed(1) : 0;
        
        const cards = [
            UIComponents.createStatsCard('Tiến độ', `${progress}%`, `${answeredCount}/${total} câu`, '📈'),
            UIComponents.createStatsCard('Độ chính xác', `${accuracy}%`, `${correctCount} đúng`, '🎯'),
            UIComponents.createStatsCard('Câu khó', '0', 'Đã đánh dấu', '🔥'),
            UIComponents.createStatsCard('Thời gian', '0 phút', 'Học tập', '⏱️')
        ];
        
        cards.forEach(card => statsContainer.appendChild(card));
        
        // Insert at the beginning of content
        const content = document.querySelector('.content');
        if (content) {
            content.insertBefore(statsContainer, content.firstChild);
        }
    }

    static addEnhancedDifficultButtons(total, partName, startNumber = 1) {
        for (let i = 1; i <= total; i++) {
            const questionElement = document.getElementById(`question${i}`);
            if (questionElement) {
                const existingButton = questionElement.querySelector('.difficult-btn');
                if (!existingButton) {
                    const button = document.createElement('button');
                    button.className = 'difficult-btn';
                    button.innerHTML = '⭐';
                    button.title = 'Đánh dấu câu khó';
                    button.style.cssText = `
                        background: linear-gradient(135deg, #4285f4 0%, #1a73e8 100%);
                        color: white;
                        border: none;
                        padding: 12px 16px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
                        min-width: 50px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    `;
                    
                    button.addEventListener('click', (event) => {
                        QuestionManager.toggleDifficultQuestion(i, partName, event);
                    });
                    
                    button.addEventListener('mouseenter', () => {
                        button.style.transform = 'translateY(-2px) scale(1.1)';
                        button.style.boxShadow = '0 8px 25px rgba(66, 133, 244, 0.4)';
                    });
                    
                    button.addEventListener('mouseleave', () => {
                        button.style.transform = 'translateY(0) scale(1)';
                        button.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
                    });
                    
                    const questionHeader = questionElement.querySelector('.question-header');
                    if (questionHeader) {
                        questionHeader.appendChild(button);
                    }
                }
            }
        }
        
        // Update existing buttons
        QuestionManager.updateDifficultButtons();
    }

    static addProgressTracking(total, partName, startNumber) {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                const questionElement = this.closest('[id^="question"]');
                if (questionElement) {
                    const questionNumber = questionElement.id.replace('question', '');
                    const isCorrect = this.value === 'correct'; // This would need to be determined based on your answer structure
                    
                    ProgressTracker.recordAnswer(questionNumber, isCorrect);
                    
                    // Update displays
                    QuizInitializer.updateAllDisplays(partName, startNumber, total);
                }
            });
        });
    }

    static initializeUIComponents() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch(event.key) {
                    case 's':
                        event.preventDefault();
                        UIComponents.showNotification('Đã lưu tiến độ!', 'success');
                        break;
                    case 'h':
                        event.preventDefault();
                        // Show help
                        break;
                }
            }
        });
        
        // Add beforeunload event to save progress
        window.addEventListener('beforeunload', () => {
            ProgressTracker.endSession();
        });
    }

    static updateAllDisplays(partName, startNumber, total) {
        const progress = QuizDataManager.getQuizProgress(partName);
        const stats = QuizDataManager.getUserStats();
        
        // Update progress displays
        const progressElements = document.querySelectorAll('[id*="progress"], [id*="Progress"]');
        progressElements.forEach(element => {
            const percentage = ((progress.answered.length / total) * 100).toFixed(1);
            element.textContent = `${percentage}%`;
        });
        
        // Update accuracy displays
        const accuracyElements = document.querySelectorAll('[id*="accuracy"], [id*="Accuracy"]');
        accuracyElements.forEach(element => {
            const accuracy = progress.answered.length > 0 ? 
                ((progress.correct.length / progress.answered.length) * 100).toFixed(1) : '0';
            element.textContent = `${accuracy}%`;
        });
        
        // Update difficult count displays
        const difficultElements = document.querySelectorAll('[id*="difficult"], [id*="Difficult"]');
        difficultElements.forEach(element => {
            element.textContent = stats.difficultQuestions;
        });
    }
}

// Legacy function compatibility
function getDifficultQuestions() {
    return QuizDataManager.getDifficultQuestions();
}

function saveDifficultQuestions(questions) {
    return QuizDataManager.saveDifficultQuestions(questions);
}

function toggleDifficultQuestion(questionNumber, source, event) {
    return QuestionManager.toggleDifficultQuestion(questionNumber, source, event);
}

function showNotification(message, type) {
    return UIComponents.showNotification(message, type);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced features
    QuestionManager.updateDifficultButtons();
    
    // Add enhanced CSS
    const enhancedStyles = document.createElement('style');
    enhancedStyles.textContent = `
        .difficult-btn.marked {
            background: linear-gradient(135deg, #fbbc04 0%, #ff9800 100%) !important;
            box-shadow: 0 4px 12px rgba(251, 188, 4, 0.4) !important;
        }
        
        .notification {
            font-family: 'Google Sans', 'Segoe UI', sans-serif;
        }
        
        .enhanced-stats {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(enhancedStyles);
});