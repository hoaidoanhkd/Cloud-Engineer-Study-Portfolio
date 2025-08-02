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
    
    // Cập nhật thống kê part nếu có
    const partStatsElement = document.getElementById('partStatsNumber');
    if (partStatsElement) {
        // Lấy thông tin part từ trang hiện tại
        const currentUrl = window.location.href;
        let startNumber = 1, total = 50;
        
        if (currentUrl.includes('part1')) { startNumber = 1; total = 50; }
        else if (currentUrl.includes('part2')) { startNumber = 51; total = 50; }
        else if (currentUrl.includes('part3')) { startNumber = 101; total = 50; }
        else if (currentUrl.includes('part4')) { startNumber = 151; total = 50; }
        else if (currentUrl.includes('part5')) { startNumber = 201; total = 50; }
        else if (currentUrl.includes('part6')) { startNumber = 251; total = 52; }
        
        updatePartStats('', startNumber, total);
    }
}

function showNotification(message, type) {
    // Tạo thông báo nhỏ với hiệu ứng đẹp hơn
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: bold;
        font-size: 14px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    // Thêm icon cho notification
    const icon = type === 'success' ? '✅' : 'ℹ️';
    notification.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    // Tự động xóa sau 3 giây với hiệu ứng fade out
    setTimeout(() => {
        notification.style.transition = 'all 0.3s ease';
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
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

// Thêm thống kê câu khó cho quiz part
function addPartStats(partName, startNumber, total) {
    const questions = getDifficultQuestions();
    const partQuestions = questions.filter(q => {
        const qNum = q.questionNumber;
        return qNum >= startNumber && qNum < startNumber + total;
    });
    
    // Tạo stats bar
    const statsBar = document.createElement('div');
    statsBar.className = 'part-stats-bar';
    statsBar.innerHTML = `
        <div class="part-stats-content">
            <span class="stats-icon">📊</span>
            <span class="stats-text">Câu khó đã đánh dấu trong phần này: </span>
            <span class="stats-number" id="partStatsNumber">${partQuestions.length}</span>
            <span class="stats-total">/${total}</span>
        </div>
    `;
    
    // Chèn vào đầu container
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

// Cập nhật thống kê part
function updatePartStats(partName, startNumber, total) {
    const questions = getDifficultQuestions();
    const partQuestions = questions.filter(q => {
        const qNum = q.questionNumber;
        return qNum >= startNumber && qNum < startNumber + total;
    });
    
    const statsNumber = document.getElementById('partStatsNumber');
    if (statsNumber) {
        statsNumber.textContent = partQuestions.length;
        
        // Thêm hiệu ứng màu
        if (partQuestions.length > 0) {
            statsNumber.style.color = '#ea4335';
        } else {
            statsNumber.style.color = '#4285f4';
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
            border-radius: 12px; 
            padding: 25px; 
            background: #fafafa;
            transition: all 0.3s ease;
        }
        .question:hover {
            border-color: #4285f4;
            box-shadow: 0 4px 12px rgba(66, 133, 244, 0.1);
        }
        .question-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 15px; 
            gap: 15px;
        }
        .difficult-btn { 
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); 
            border: none; 
            padding: 10px 18px; 
            border-radius: 25px; 
            cursor: pointer; 
            font-size: 13px; 
            font-weight: bold; 
            color: #333; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 3px 8px rgba(255, 215, 0, 0.3);
            white-space: nowrap;
            position: relative;
            overflow: hidden;
        }
        .difficult-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        .difficult-btn:hover::before {
            left: 100%;
        }
        .difficult-btn:hover { 
            transform: translateY(-3px) scale(1.05); 
            box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4); 
        }
        .difficult-btn:active {
            transform: translateY(-1px) scale(1.02);
        }
        .difficult-btn.marked { 
            background: linear-gradient(135deg, #ea4335 0%, #fbbc04 100%); 
            color: white; 
            box-shadow: 0 3px 8px rgba(234, 67, 53, 0.3);
            animation: pulse 2s infinite;
        }
        .difficult-btn.marked:hover {
            box-shadow: 0 6px 16px rgba(234, 67, 53, 0.4);
        }
        @keyframes pulse {
            0% { box-shadow: 0 3px 8px rgba(234, 67, 53, 0.3); }
            50% { box-shadow: 0 3px 8px rgba(234, 67, 53, 0.5), 0 0 0 4px rgba(234, 67, 53, 0.1); }
            100% { box-shadow: 0 3px 8px rgba(234, 67, 53, 0.3); }
        }
        .question-content { 
            flex: 1; 
            margin-right: 15px;
        }
        .question-content p {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin-bottom: 15px;
        }
        .question-stats {
            position: absolute;
            top: -12px;
            right: 15px;
            background: #4285f4;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        }
        .part-stats-bar {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 1px solid #dee2e6;
            border-radius: 12px;
            padding: 15px 20px;
            margin: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .part-stats-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
        }
        .stats-icon {
            font-size: 18px;
        }
        .stats-text {
            color: #495057;
        }
        .stats-number {
            font-size: 18px;
            font-weight: bold;
            color: #4285f4;
            transition: color 0.3s ease;
        }
        .stats-total {
            color: #6c757d;
            font-size: 14px;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        .notification {
            animation: bounceIn 0.5s ease;
        }
        @media (max-width: 768px) {
            .question-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            .question-content {
                margin-right: 0;
                margin-bottom: 10px;
            }
            .difficult-btn {
                align-self: flex-start;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Thêm thống kê part
    addPartStats(partName, startNumber, total);
    
    // Thêm nút đánh dấu câu khó
    addDifficultButtons(total, partName, startNumber);
    
    // Cập nhật trạng thái nút và thống kê
    setTimeout(() => {
        updateDifficultButtons(total, partName, startNumber);
        updatePartStats(partName, startNumber, total);
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