# 🎯 Mô phỏng đề thi thực tế với Fisher-Yates Shuffle

## 📚 Tổng quan

Hệ thống mô phỏng đề thi thực tế được thiết kế để tạo ra trải nghiệm thi cử gần với kỳ thi thực tế nhất, sử dụng thuật toán **Fisher-Yates Shuffle** để xáo trộn câu hỏi một cách công bằng và ngẫu nhiên.

## 🎮 Các file mô phỏng

### 1. `exam-simulation.html` - Mô phỏng cơ bản
- Giao diện thi đơn giản
- Xáo trộn câu hỏi theo Fisher-Yates
- Timer và progress tracking
- Kết quả thi chi tiết

### 2. `real-exam-simulation.html` - Mô phỏng nâng cao
- Tải câu hỏi thực tế từ các file HTML
- Cài đặt linh hoạt (thời gian, số câu, chế độ xáo trộn)
- So sánh các thuật toán xáo trộn
- Giao diện chuyên nghiệp

## 🔀 Thuật toán xáo trộn

### Fisher-Yates (Khuyến nghị)
```javascript
fisherYatesShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
```

### Simple Shuffle
```javascript
simpleShuffle(array) {
    const shuffled = [...array];
    for (let i = 0; i < shuffled.length; i++) {
        const j = Math.floor(Math.random() * shuffled.length);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
```

## ⚙️ Tính năng cài đặt

### Thời gian thi
- **1 giờ**: Phù hợp cho bài thi ngắn
- **2 giờ**: Thời gian chuẩn cho đề thi GCP
- **3 giờ**: Cho bài thi dài hoặc thực hành

### Số câu hỏi
- **25 câu**: Thi nhanh, kiểm tra kiến thức cơ bản
- **50 câu**: Đề thi chuẩn, cân bằng thời gian
- **100 câu**: Thi toàn diện, kiểm tra sâu
- **Tất cả (302 câu)**: Thi đầy đủ, mô phỏng thực tế

### Chế độ xáo trộn
- **Fisher-Yates**: Thuật toán tối ưu, đảm bảo công bằng
- **Đơn giản**: Thuật toán cơ bản, dễ hiểu
- **Không xáo trộn**: Giữ nguyên thứ tự gốc

## 🎯 Tính năng chính

### 1. Giao diện thi chuyên nghiệp
- Header cố định với timer và progress
- Navigation buttons cho từng câu hỏi
- Controls cố định ở bottom
- Responsive design cho mobile

### 2. Timer thông minh
- Đếm ngược thời gian thực
- Tự động nộp bài khi hết giờ
- Hiển thị format HH:MM:SS

### 3. Progress tracking
- Thanh tiến độ trực quan
- Số câu đã trả lời / tổng số
- Navigation buttons có màu sắc phân biệt

### 4. Kết quả chi tiết
- Tổng số câu hỏi
- Số câu đã trả lời
- Số câu đúng
- Tỷ lệ đúng (%)
- Thời gian làm bài
- Thuật toán xáo trộn đã sử dụng

## 🔧 Cách sử dụng

### 1. Khởi động mô phỏng
```bash
# Mở file trong browser
open exam-simulation.html
# hoặc
open real-exam-simulation.html
```

### 2. Cài đặt đề thi
- Chọn thời gian thi phù hợp
- Chọn số câu hỏi mong muốn
- Chọn chế độ xáo trộn (khuyến nghị Fisher-Yates)
- Nhấn "Bắt đầu thi"

### 3. Làm bài thi
- Đọc câu hỏi cẩn thận
- Chọn đáp án bằng cách click
- Sử dụng navigation để di chuyển giữa các câu
- Theo dõi thời gian và tiến độ

### 4. Nộp bài
- Nhấn "Nộp bài" khi hoàn thành
- Xác nhận trong modal
- Xem kết quả chi tiết

## 📊 So sánh thuật toán

| Thuật toán | Độ phức tạp | Tính công bằng | Ưu điểm | Nhược điểm |
|------------|-------------|----------------|---------|------------|
| **Fisher-Yates** | O(n) | ⭐⭐⭐⭐⭐ | Công bằng nhất, hiệu quả | Phức tạp hơn |
| **Simple** | O(n) | ⭐⭐⭐ | Đơn giản, dễ hiểu | Có thể không công bằng |
| **Không xáo trộn** | O(1) | ⭐ | Nhanh nhất | Không ngẫu nhiên |

## 🎯 Lợi ích của mô phỏng

### Cho người học:
- **Trải nghiệm thực tế**: Giao diện giống thi thật
- **Quản lý thời gian**: Học cách phân bổ thời gian
- **Áp lực thi cử**: Làm quen với áp lực thời gian
- **Đánh giá chính xác**: Kết quả phản ánh đúng năng lực

### Cho giáo viên:
- **Tạo đề thi**: Dễ dàng tạo nhiều phiên bản khác nhau
- **Đánh giá học viên**: Theo dõi tiến độ và kết quả
- **Phân tích**: Thống kê về hiệu quả học tập

## 🔍 Kiểm tra chất lượng

### Test cases:
1. **Xáo trộn 50 câu hỏi**: Đảm bảo không có pattern lặp lại
2. **Timer chính xác**: Thời gian đếm ngược chính xác
3. **Progress tracking**: Theo dõi tiến độ đúng
4. **Kết quả tính toán**: Đáp án đúng được tính chính xác
5. **Responsive design**: Hoạt động tốt trên mobile

### Validation:
```javascript
// Kiểm tra tính ngẫu nhiên
function testShuffleQuality(iterations = 1000) {
    const results = [];
    for (let i = 0; i < iterations; i++) {
        const shuffled = fisherYatesShuffle([1,2,3,4,5]);
        results.push(shuffled.join(','));
    }
    
    const uniquePermutations = new Set(results);
    const expectedPermutations = 120; // 5! = 120
    
    return {
        uniqueCount: uniquePermutations.size,
        expectedCount: expectedPermutations,
        quality: uniquePermutations.size / expectedPermutations
    };
}
```

## 🚀 Tính năng nâng cao

### 1. Auto-save
- Tự động lưu tiến độ
- Khôi phục khi refresh trang
- Export/Import kết quả

### 2. Analytics
- Thống kê thời gian làm từng câu
- Phân tích câu hỏi khó/dễ
- Biểu đồ tiến độ học tập

### 3. Multi-language
- Hỗ trợ nhiều ngôn ngữ
- Giao diện đa văn hóa
- Đề thi đa ngôn ngữ

### 4. Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode

## 📝 Kết luận

Hệ thống mô phỏng đề thi thực tế với Fisher-Yates shuffle mang lại:

1. **Trải nghiệm chân thực**: Gần với thi thật nhất có thể
2. **Tính công bằng**: Thuật toán Fisher-Yates đảm bảo công bằng
3. **Linh hoạt**: Nhiều tùy chọn cài đặt
4. **Chuyên nghiệp**: Giao diện đẹp, dễ sử dụng
5. **Hiệu quả**: Giúp học viên chuẩn bị tốt cho kỳ thi thật

Việc sử dụng thuật toán Fisher-Yates trong mô phỏng đề thi không chỉ đảm bảo tính ngẫu nhiên mà còn giúp người học có trải nghiệm thi cử công bằng và chân thực nhất.
