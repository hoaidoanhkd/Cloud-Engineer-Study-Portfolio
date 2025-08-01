// Chức năng quản lý câu khó - Common cho tất cả quiz parts
function getDifficultQuestions() {
    const stored = localStorage.getItem('difficultQuestions');
    return stored ? JSON.parse(stored) : [];
}

function saveDifficultQuestions(questions) {
    localStorage.setItem('difficultQuestions', JSON.stringify(questions));
}

function toggleDifficultQuestion(questionNumber, source) {
    const questions = getDifficultQuestions();
    const questionId = `q${questionNumber}_${source}`;
    const existingIndex = questions.findIndex(q => q.id === questionId);
    
    const questionElement = document.getElementById(`question${questionNumber}`);
    const questionText = questionElement.querySelector('.question-content p, p').textContent.trim();
    const button = questionElement.querySelector('.difficult-btn');
    
    if (existingIndex > -1) {
        // Xóa câu khó
        questions.splice(existingIndex, 1);
        button.textContent = '⭐ Đánh dấu câu khó';
        button.classList.remove('marked');
        showNotification('Đã bỏ đánh dấu câu khó!', 'info');
    } else {
        // Thêm câu khó
        questions.push({
            id: questionId,
            questionNumber: questionNumber,
            text: questionText,
            source: source,
            timestamp: new Date().toISOString()
        });
        button.textContent = '🔥 Đã đánh dấu';
        button.classList.add('marked');
        showNotification('Đã đánh dấu câu khó!', 'success');
    }
    
    saveDifficultQuestions(questions);
}

function showNotification(message, type) {
    // Tạo thông báo nhỏ
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Cập nhật trạng thái các nút khi trang load
function updateDifficultButtons(total, partName) {
    const questions = getDifficultQuestions();
    for (let i = 1; i <= total; i++) {
        const questionId = `q${i}_${partName}`;
        const button = document.querySelector(`#question${i} .difficult-btn`);
        if (button && questions.some(q => q.id === questionId)) {
            button.textContent = '🔥 Đã đánh dấu';
            button.classList.add('marked');
        }
    }
}

// Thêm nút đánh dấu câu khó cho tất cả câu hỏi
function addDifficultButtons(total, partName, startNumber = 1) {
    for (let i = 1; i <= total; i++) {
        const questionDiv = document.querySelector(`.question:nth-of-type(${i})`);
        if (questionDiv && !questionDiv.id) {
            const actualQuestionNumber = startNumber + i - 1;
            questionDiv.id = `question${actualQuestionNumber}`;
            
            // Tìm thẻ p chứa câu hỏi
            const questionP = questionDiv.querySelector('p');
            if (questionP) {
                // Tạo header mới
                const header = document.createElement('div');
                header.className = 'question-header';
                
                const content = document.createElement('div');
                content.className = 'question-content';
                content.appendChild(questionP.cloneNode(true));
                
                const button = document.createElement('button');
                button.className = 'difficult-btn';
                button.textContent = '⭐ Đánh dấu câu khó';
                button.onclick = () => toggleDifficultQuestion(actualQuestionNumber, partName);
                
                header.appendChild(content);
                header.appendChild(button);
                
                // Thay thế p cũ bằng header mới
                questionDiv.replaceChild(header, questionP);
            }
        }
    }
}

// Khởi tạo quiz với chức năng đánh dấu câu khó
function initializeQuiz(correctAnswers, total, partName, startNumber = 1) {
    // Thêm CSS
    const style = document.createElement('style');
    style.textContent = `
        .question { 
            margin-bottom: 30px; 
            position: relative; 
            border: 1px solid #e0e0e0; 
            border-radius: 8px; 
            padding: 20px; 
        }
        .question-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 15px; 
        }
        .difficult-btn { 
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); 
            border: none; 
            padding: 8px 15px; 
            border-radius: 20px; 
            cursor: pointer; 
            font-size: 12px; 
            font-weight: bold; 
            color: #333; 
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            white-space: nowrap;
        }
        .difficult-btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
        }
        .difficult-btn.marked { 
            background: linear-gradient(135deg, #ea4335 0%, #fbbc04 100%); 
            color: white; 
        }
        .question-content { 
            flex: 1; 
            margin-right: 15px;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
            .question-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .question-content {
                margin-right: 0;
                margin-bottom: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Thêm nút đánh dấu câu khó
    addDifficultButtons(total, partName, startNumber);
    
    // Cập nhật trạng thái nút
    setTimeout(() => {
        updateDifficultButtons(total, partName, startNumber);
    }, 100);
    
    // Logic quiz gốc
    for (let i = 1; i <= total; i++) {
        const radios = document.getElementsByName(`q${i}`);
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                radios.forEach(r => {
                    const label = r.parentElement;
                    label.style.fontWeight = "normal";
                    label.style.color = "black";
                });

                const label = this.parentElement;
                if (this.value === correctAnswers[i - 1]) {
                    label.style.color = "green";
                    label.style.fontWeight = "bold";
                } else {
                    label.style.color = "red";
                    label.style.fontWeight = "bold";
                }
            });
        });
    }
}

// Cập nhật hàm updateDifficultButtons để hỗ trợ startNumber
function updateDifficultButtons(total, partName, startNumber = 1) {
    const questions = getDifficultQuestions();
    for (let i = 1; i <= total; i++) {
        const actualQuestionNumber = startNumber + i - 1;
        const questionId = `q${actualQuestionNumber}_${partName}`;
        const button = document.querySelector(`#question${actualQuestionNumber} .difficult-btn`);
        if (button && questions.some(q => q.id === questionId)) {
            button.textContent = '🔥 Đã đánh dấu';
            button.classList.add('marked');
        }
    }
}