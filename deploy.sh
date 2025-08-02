#!/bin/bash

echo "🚀 Bắt đầu triển khai ứng dụng GCP Quiz..."

# Install dependencies
echo "📦 Cài đặt dependencies..."
npm install

# Build the application
echo "🔨 Build ứng dụng..."
npm run build

# Copy quiz parts
echo "📋 Copy các phần quiz..."
mkdir -p dist/quiz-parts
cp quiz-parts/*.html dist/quiz-parts/
cp README.md dist/

# List final structure
echo "📁 Cấu trúc file cuối cùng:"
ls -la dist/
echo ""
ls -la dist/quiz-parts/

echo "✅ Triển khai hoàn tất!"
echo ""
echo "🌐 Để chạy ứng dụng:"
echo "   npm run preview  (chạy local preview)"
echo "   npm start       (chạy production server)"
echo ""
echo "📊 Thống kê:"
echo "   - Tổng số câu hỏi: 302"
echo "   - Chia thành 6 phần (mỗi phần ~50 câu)"
echo "   - Hỗ trợ TypeScript + Vite"
echo "   - Sẵn sàng deploy lên Render.com"