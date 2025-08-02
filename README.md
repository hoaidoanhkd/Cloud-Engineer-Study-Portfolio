# 🎯 GCP Exam Practice - Hệ thống luyện tập kiểm tra Google Cloud Platform

## 📚 Tổng quan

Hệ thống luyện tập GCP hoàn chỉnh với **302 câu hỏi** được chia thành **6 phần** để học tập hiệu quả và có hệ thống.

## 🚀 Tính năng chính

### ✅ 6 Phần Quiz Chuyên Sâu
- **Phần 1** (Câu 1-50): Kiến thức nền tảng GCP, IAM và các dịch vụ cơ bản
- **Phần 2** (Câu 51-100): Compute Engine, mạng và cân bằng tải  
- **Phần 3** (Câu 101-150): Kubernetes Engine, containers và điều phối
- **Phần 4** (Câu 151-200): Lưu trữ, cơ sở dữ liệu và dịch vụ dữ liệu
- **Phần 5** (Câu 201-250): Bảo mật, giám sát và vận hành
- **Phần 6** (Câu 251-302): Chủ đề nâng cao và kịch bản tổng hợp

### ⚡ Tính năng tương tác
- **Phản hồi ngay lập tức**: Màu xanh = đúng, màu đỏ = sai
- **Đánh dấu câu khó**: Lưu câu khó để ôn tập sau
- **Thống kê chi tiết**: Theo dõi tiến độ học tập
- **Navigation linh hoạt**: Di chuyển dễ dàng giữa các phần

## 🌐 Cách sử dụng

### Khởi động server local:
```bash
python3 -m http.server 8080
```

### Truy cập ứng dụng:
- **Trang chủ chính**: `http://localhost:8080/quiz-parts/`
- **Hướng dẫn sử dụng**: `http://localhost:8080/`
- **Câu hỏi khó**: `http://localhost:8080/difficult-questions.html`

## 📁 Cấu trúc dự án

```
/
├── index.html                          # Trang hướng dẫn sử dụng
├── quiz-parts/                         # Thư mục chứa 6 phần quiz
│   ├── index.html                     # Trang chủ chính (danh sách 6 phần)
│   ├── part1-questions-1-50.html      # Phần 1
│   ├── part2-questions-51-100.html    # Phần 2
│   ├── part3-questions-101-150.html   # Phần 3
│   ├── part4-questions-151-200.html   # Phần 4
│   ├── part5-questions-201-250.html   # Phần 5
│   └── part6-questions-251-302.html   # Phần 6
├── quiz-common.js                      # Logic chung cho tất cả quiz
├── difficult-questions.html            # Trang câu hỏi khó
└── src/                               # Source code TypeScript (tùy chọn)
```

## 🎨 Giao diện

- **Thiết kế hiện đại**: Gradient đẹp mắt, responsive
- **UX tối ưu**: Dễ sử dụng, navigation trực quan
- **Mobile-friendly**: Hoạt động tốt trên mọi thiết bị

## 📊 Thống kê

- **302** câu hỏi tổng cộng
- **6** phần học có hệ thống
- **~50** câu hỏi mỗi phần
- **100%** miễn phí

## 🔧 Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Gradients
- **Storage**: LocalStorage cho câu khó và thống kê
- **Server**: Python HTTP Server (development)

## 🚀 Triển khai

Hệ thống đã sẵn sàng sử dụng ngay! Chỉ cần khởi động server và truy cập qua browser.

---

**© 2024 GCP Exam Practice - Học tập hiệu quả, thành công trong kỳ thi!** 🎯 