# 🔀 Fisher-Yates (Knuth Shuffle) Algorithm Implementation

## 📚 Tổng quan

Dự án này đã tích hợp thuật toán **Fisher-Yates Shuffle** (còn gọi là Knuth Shuffle) vào hệ thống quiz để xáo trộn ngẫu nhiên thứ tự câu hỏi, đảm bảo mỗi lần làm quiz có trải nghiệm khác nhau và tránh học vẹt.

## 🎯 Thuật toán Fisher-Yates

### Nguyên lý hoạt động

```javascript
function fisherYatesShuffle(array) {
    const shuffled = [...array]; // Tạo bản sao để không thay đổi mảng gốc
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Hoán đổi phần tử
    }
    return shuffled;
}
```

### Cách thức hoạt động

1. **Duyệt ngược**: Bắt đầu từ phần tử cuối cùng và đi ngược lên
2. **Chọn ngẫu nhiên**: Với mỗi vị trí `i`, chọn ngẫu nhiên một vị trí `j` từ `0` đến `i`
3. **Hoán đổi**: Hoán đổi phần tử tại vị trí `i` với phần tử tại vị trí `j`
4. **Lặp lại**: Tiếp tục cho đến khi duyệt hết mảng

### Ưu điểm

- ✅ **Hiệu quả**: Độ phức tạp O(n) - chỉ cần duyệt mảng một lần
- ✅ **Công bằng**: Mỗi hoán vị có xác suất xuất hiện bằng nhau (1/n!)
- ✅ **Đơn giản**: Dễ hiểu và triển khai
- ✅ **In-place**: Có thể thực hiện trực tiếp trên mảng gốc

## 🔧 Tích hợp vào Quiz System

### 1. Cấu trúc dữ liệu

```javascript
class QuizManager {
    constructor() {
        this.shuffledQuestionOrder = []; // Theo dõi thứ tự đã xáo trộn
    }
}
```

### 2. Hàm xáo trộn câu hỏi

```javascript
shuffleQuestions(total, correctAnswers, startNumber) {
    // Tạo mảng số thứ tự câu hỏi
    const questionNumbers = Array.from({length: total}, (_, i) => i + 1);
    
    // Xáo trộn số thứ tự
    const shuffledQuestionNumbers = this.fisherYatesShuffle(questionNumbers);
    
    // Tạo mảng đáp án đúng đã xáo trộn
    const shuffledCorrectAnswers = shuffledQuestionNumbers.map(qNum => 
        correctAnswers[qNum - 1]
    );
    
    // Lưu mapping để theo dõi
    this.shuffledQuestionOrder = shuffledQuestionNumbers.map((qNum, index) => ({
        originalNumber: qNum,
        displayNumber: index + 1,
        actualQuestionNumber: startNumber + qNum - 1
    }));
    
    return {
        shuffledQuestionNumbers,
        shuffledCorrectAnswers,
        questionMapping: this.shuffledQuestionOrder
    };
}
```

### 3. Áp dụng vào DOM

```javascript
applyShuffledOrder() {
    const quizForm = document.getElementById('quizForm');
    const questions = Array.from(quizForm.querySelectorAll('.question'));
    
    // Tạo container mới cho câu hỏi đã xáo trộn
    const questionContainer = document.createElement('div');
    questionContainer.id = 'shuffled-questions-container';
    
    // Sắp xếp lại câu hỏi theo thứ tự đã xáo trộn
    this.shuffledQuestionOrder.forEach((mapping, index) => {
        const originalQuestion = questions[mapping.originalNumber - 1];
        if (originalQuestion) {
            const clonedQuestion = originalQuestion.cloneNode(true);
            
            // Cập nhật số thứ tự hiển thị
            const questionText = clonedQuestion.querySelector('p strong');
            if (questionText) {
                questionText.textContent = `Question ${mapping.displayNumber}:`;
            }
            
            // Cập nhật tên radio button
            const radioButtons = clonedQuestion.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.name = `q${mapping.displayNumber}`;
            });
            
            questionContainer.appendChild(clonedQuestion);
        }
    });
    
    // Thay thế câu hỏi cũ bằng câu hỏi đã xáo trộn
    questions.forEach(q => q.remove());
    quizForm.appendChild(questionContainer);
}
```

## 🎮 Tính năng bổ sung

### 1. Nút xáo trộn lại

```javascript
addShuffleButton() {
    const shuffleButton = document.createElement('button');
    shuffleButton.id = 'shuffle-questions-btn';
    shuffleButton.className = 'shuffle-btn';
    shuffleButton.innerHTML = '🔀 Xáo trộn câu hỏi';
    shuffleButton.onclick = () => this.reshuffleQuestions();
    
    document.body.appendChild(shuffleButton);
}
```

### 2. Thông báo

```javascript
showNotification('🔀 Câu hỏi đã được xáo trộn ngẫu nhiên theo thuật toán Fisher-Yates!', 'info');
```

### 3. Theo dõi mapping

```javascript
getOriginalQuestionNumber(displayNumber) {
    const mapping = this.shuffledQuestionOrder.find(m => m.displayNumber === displayNumber);
    return mapping ? mapping.originalNumber : displayNumber;
}

getActualQuestionNumber(displayNumber) {
    const mapping = this.shuffledQuestionOrder.find(m => m.displayNumber === displayNumber);
    return mapping ? mapping.actualQuestionNumber : displayNumber;
}
```

## 📊 Demo tương tác

File `fisher-yates-demo.html` cung cấp demo tương tác để:

- Xem thuật toán hoạt động từng bước
- Tạo mảng ngẫu nhiên và xáo trộn
- Theo dõi số lần xáo trộn và hoán vị khác nhau
- Hiểu rõ cách thuật toán hoạt động

## 🚀 Cách sử dụng

### 1. Khởi tạo quiz với xáo trộn

```javascript
const quizManager = new QuizManager();
quizManager.initializeQuiz('part1', 1); // Tự động xáo trộn câu hỏi
```

### 2. Xáo trộn lại

```javascript
quizManager.reshuffleQuestions(); // Xáo trộn lại câu hỏi
```

### 3. Theo dõi mapping

```javascript
const originalNum = quizManager.getOriginalQuestionNumber(5); // Lấy số câu hỏi gốc
const actualNum = quizManager.getActualQuestionNumber(5); // Lấy số câu hỏi thực tế
```

## 📈 Lợi ích

### Cho người học:
- **Tránh học vẹt**: Không thể dựa vào thứ tự câu hỏi
- **Tăng độ khó**: Mỗi lần làm quiz có trải nghiệm khác nhau
- **Cải thiện hiệu quả**: Buộc phải hiểu nội dung thay vì nhớ vị trí

### Cho hệ thống:
- **Tính ngẫu nhiên**: Đảm bảo công bằng cho tất cả người dùng
- **Hiệu suất cao**: Thuật toán O(n) nhanh và hiệu quả
- **Dễ bảo trì**: Code rõ ràng, dễ hiểu và mở rộng

## 🔍 Kiểm tra chất lượng

### Test cases:

1. **Xáo trộn mảng rỗng**: Không gây lỗi
2. **Xáo trộn mảng 1 phần tử**: Giữ nguyên
3. **Xáo trộn mảng lớn**: Hiệu suất tốt
4. **Xáo trộn nhiều lần**: Không có pattern lặp lại
5. **Mapping chính xác**: Đáp án đúng tương ứng với câu hỏi

### Validation:

```javascript
// Kiểm tra tính ngẫu nhiên
function testRandomness(array, iterations = 1000) {
    const permutations = new Set();
    
    for (let i = 0; i < iterations; i++) {
        const shuffled = fisherYatesShuffle(array);
        permutations.add(shuffled.join(','));
    }
    
    return permutations.size; // Số hoán vị khác nhau
}
```

## 📝 Kết luận

Việc tích hợp thuật toán Fisher-Yates vào hệ thống quiz đã mang lại:

1. **Tính ngẫu nhiên cao**: Mỗi lần làm quiz có trải nghiệm khác nhau
2. **Hiệu suất tốt**: Thuật toán O(n) nhanh và hiệu quả
3. **Dễ sử dụng**: Giao diện thân thiện với nút xáo trộn
4. **Tính mở rộng**: Dễ dàng áp dụng cho các phần quiz khác

Thuật toán này đảm bảo rằng việc học tập thông qua quiz trở nên hiệu quả và công bằng hơn cho tất cả người dùng.
