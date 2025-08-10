// Chức năng quản lý câu khó - Common cho tất cả quiz parts
function getDifficultQuestions() {
    try {
        const stored = localStorage.getItem('difficultQuestions');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

function saveDifficultQuestions(questions) {
    try {
        localStorage.setItem('difficultQuestions', JSON.stringify(questions));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        showNotification('Không thể lưu dữ liệu. Vui lòng kiểm tra quyền truy cập.', 'error');
    }
}

function toggleDifficultQuestion(questionNumber, source, event) {
    // Lưu vị trí scroll hiện tại
    const currentScrollY = window.scrollY;
    
    // Ngăn chặn scroll về đầu
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    const questions = getDifficultQuestions();
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
    
    // Lấy đáp án từ các option A, B, C, D
    const answers = [];
    const answerElements = questionElement.querySelectorAll('.answers label');
    answerElements.forEach((label, index) => {
        const input = label.querySelector('input');
        let answerText = label.textContent.trim();
        
        if (answerText) {
            // Loại bỏ hoàn toàn phần "A.", "B.", "C.", "D." ở đầu
            const labelPattern = /^[A-D]\.\s*/;
            answerText = answerText.replace(labelPattern, '');
            
            // Loại bỏ thêm nếu vẫn còn trùng lặp
            const duplicatePattern = /^([A-D])\.\s*\1\.\s*/;
            if (duplicatePattern.test(answerText)) {
                answerText = answerText.replace(duplicatePattern, '$1. ');
            }
            
            answers.push(answerText);
        }
    });
    
    if (existingIndex > -1) {
        // Xóa câu khó
        questions.splice(existingIndex, 1);
        button.textContent = '⭐ ';
        button.classList.remove('marked');
        // Thêm hiệu ứng nhỏ
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    } else {
        // Thêm câu khó
        questions.push({
            id: questionId,
            questionNumber: questionNumber,
            text: questionText,
            answers: answers,
            source: source,
            timestamp: new Date().toISOString()
        });
        button.textContent = '🔥';
        button.classList.add('marked');
        // Thêm hiệu ứng nhỏ
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1.05)';
        }, 150);
    }
    
    saveDifficultQuestions(questions);
    
    // Khôi phục vị trí scroll
    setTimeout(() => {
        window.scrollTo(0, currentScrollY);
    }, 0);
    
    // Ngăn chặn scroll về đầu
    return false;
}

function showNotification(message, type) {
    // Tạo thông báo nhỏ với hiệu ứng đẹp hơn
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
    `;
    
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
            button.textContent = '🔥';
            button.classList.add('marked');
        }
    }
}

// Thêm nút  cho tất cả câu hỏi
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
                button.type = 'button';
                button.className = 'difficult-btn';
                button.textContent = '⭐ ';
                button.setAttribute('data-question', actualQuestionNumber);
                button.setAttribute('data-source', partName);
                button.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const qNum = parseInt(this.getAttribute('data-question'));
                    const source = this.getAttribute('data-source');
                    toggleDifficultQuestion(qNum, source, event);
                });
                
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
    
    // Tạo stats bar với nút check khó tất cả
    const statsBar = document.createElement('div');
    statsBar.className = 'part-stats-bar';
    statsBar.innerHTML = `
        <div class="part-stats-content">
            <span class="stats-icon">📊</span>
            <span class="stats-text">Câu khó trong phần này: </span>
            <span class="stats-number" id="partStatsNumber">${partQuestions.length}</span>
            <span class="stats-total">/${total}</span>
            <button type="button" class="check-all-difficult-btn" id="checkAllDifficultBtn">
                <span class="check-all-icon">🔥</span>
                <span class="check-all-text">Check khó tất cả</span>
            </button>
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
    
    // Thêm event listener cho nút check khó tất cả
    const checkAllBtn = document.getElementById('checkAllDifficultBtn');
    if (checkAllBtn) {
        checkAllBtn.addEventListener('click', function() {
            checkAllDifficultQuestions(partName, startNumber, total);
        });
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

// Hàm đánh dấu tất cả câu hỏi trong part là khó
function checkAllDifficultQuestions(partName, startNumber, total) {
    const questions = getDifficultQuestions();
    let addedCount = 0;
    
    // Lưu vị trí scroll hiện tại
    const currentScrollY = window.scrollY;
    
    for (let i = startNumber; i < startNumber + total; i++) {
        const questionId = `q${i}_${partName}`;
        const existingIndex = questions.findIndex(q => q.id === questionId);
        
        if (existingIndex === -1) {
            // Chỉ thêm nếu chưa có
            const questionElement = document.getElementById(`question${i}`);
            if (questionElement) {
                const questionTextElement = questionElement.querySelector('.question-content p, p');
                if (questionTextElement) {
                    const questionText = questionTextElement.textContent.trim();
                    
                    // Lấy đáp án từ các option A, B, C, D
                    const answers = [];
                    const answerElements = questionElement.querySelectorAll('.answers label');
                    answerElements.forEach((label, index) => {
                        const input = label.querySelector('input');
                        let answerText = label.textContent.trim();
                        
                        if (answerText) {
                            // Loại bỏ hoàn toàn phần "A.", "B.", "C.", "D." ở đầu
                            const labelPattern = /^[A-D]\.\s*/;
                            answerText = answerText.replace(labelPattern, '');
                            
                            // Loại bỏ thêm nếu vẫn còn trùng lặp
                            const duplicatePattern = /^([A-D])\.\s*\1\.\s*/;
                            if (duplicatePattern.test(answerText)) {
                                answerText = answerText.replace(duplicatePattern, '$1. ');
                            }
                            
                            answers.push(answerText);
                        }
                    });
                    
                    questions.push({
                        id: questionId,
                        questionNumber: i,
                        text: questionText,
                        answers: answers,
                        source: partName,
                        timestamp: new Date().toISOString()
                    });
                    
                    addedCount++;
                    
                    // Cập nhật nút
                    const button = questionElement.querySelector('.difficult-btn');
                    if (button) {
                        button.textContent = '🔥';
                        button.classList.add('marked');
                    }
                }
            }
        }
    }
    
    // Lưu vào localStorage
    saveDifficultQuestions(questions);
    
    // Cập nhật thống kê
    updatePartStats(partName, startNumber, total);
    
    // Hiển thị thông báo
    if (addedCount > 0) {
        showNotification(`Đã đánh dấu ${addedCount} câu hỏi là khó!`, 'success');
    } else {
        showNotification('Tất cả câu hỏi đã được đánh dấu khó!', 'warning');
    }
    
    // Khôi phục vị trí scroll
    setTimeout(() => {
        window.scrollTo(0, currentScrollY);
    }, 0);
}

// Khởi tạo quiz với chức năng 
function initializeQuiz(correctAnswers, total, partName, startNumber = 1) {
    // Validation
    if (!Array.isArray(correctAnswers) || correctAnswers.length !== total) {
        console.error('Invalid correctAnswers array or length mismatch');
        return;
    }
    
    if (typeof total !== 'number' || total <= 0) {
        console.error('Invalid total parameter');
        return;
    }
    
    if (typeof partName !== 'string' || partName.trim() === '') {
        console.error('Invalid partName parameter');
        return;
    }
    
    if (typeof startNumber !== 'number' || startNumber < 1) {
        console.error('Invalid startNumber parameter');
        return;
    }
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
            outline: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            transform: scale(1);
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
            transform: scale(1.05);
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
        .check-all-difficult-btn {
            background: linear-gradient(135deg, #ea4335 0%, #fbbc04 100%);
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 3px 8px rgba(234, 67, 53, 0.3);
            white-space: nowrap;
            position: relative;
            overflow: hidden;
            outline: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            transform: scale(1);
            margin-left: 15px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .check-all-difficult-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        .check-all-difficult-btn:hover::before {
            left: 100%;
        }
        .check-all-difficult-btn:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 5px 15px rgba(234, 67, 53, 0.4);
        }
        .check-all-difficult-btn:active {
            transform: translateY(-1px) scale(1.02);
        }
        .check-all-icon {
            font-size: 14px;
        }
        .check-all-text {
            font-size: 11px;
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
            .part-stats-content {
                flex-direction: column;
                gap: 10px;
                align-items: center;
            }
            .check-all-difficult-btn {
                margin-left: 0;
                margin-top: 5px;
                width: 100%;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Thêm thống kê part
    addPartStats(partName, startNumber, total);
    
    // Thêm nút 
    addDifficultButtons(total, partName, startNumber);
    
    // Cập nhật trạng thái nút và thống kê
    setTimeout(() => {
        updateDifficultButtons(total, partName, startNumber);
        updatePartStats(partName, startNumber, total);
    }, 100);
    
    // Logic quiz gốc
    for (let i = 1; i <= total; i++) {
        const radios = document.getElementsByName(`q${i}`);
        if (radios.length === 0) {
            console.warn(`No radio buttons found for question ${i}`);
            continue;
        }
        
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Reset all labels
                radios.forEach(r => {
                    const label = r.parentElement;
                    if (label) {
                        label.style.fontWeight = "normal";
                        label.style.color = "black";
                        label.style.backgroundColor = "transparent";
                    }
                });

                const label = this.parentElement;
                if (!label) {
                    console.error(`Label not found for radio button in question ${i}`);
                    return;
                }
                
                const correctAnswer = correctAnswers[i - 1];
                if (!correctAnswer) {
                    console.error(`No correct answer defined for question ${i}`);
                    return;
                }
                
                if (this.value === correctAnswer) {
                    label.style.color = "green";
                    label.style.fontWeight = "bold";
                    label.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
                } else {
                    label.style.color = "red";
                    label.style.fontWeight = "bold";
                    label.style.backgroundColor = "rgba(244, 67, 54, 0.1)";
                    
                    // Highlight correct answer
                    radios.forEach(r => {
                        if (r.value === correctAnswer) {
                            const correctLabel = r.parentElement;
                            if (correctLabel) {
                                correctLabel.style.color = "green";
                                correctLabel.style.fontWeight = "bold";
                                correctLabel.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
                            }
                        }
                    });
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
            button.textContent = '🔥';
            button.classList.add('marked');
        }
    }
}