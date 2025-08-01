# GCP Learning Hub - Quiz Application

## 📋 Tổng quan

GCP Learning Hub là một ứng dụng quiz tương tác được thiết kế để giúp người dùng học và luyện thi Google Cloud Platform (GCP) Associate Cloud Engineer certification. Ứng dụng cung cấp giao diện hiện đại, responsive và các tính năng theo dõi tiến độ học tập.

## 🚀 Tính năng chính

### 🎯 Quiz System
- **302 câu hỏi GCP** được phân loại theo chủ đề
- **Hỗ trợ 2 loại câu hỏi**: Radio (chọn 1) và Checkbox (chọn nhiều)
- **Randomize questions** và answer options
- **Review mode** với feedback chi tiết
- **Progress tracking** và persistence

### 📊 Analytics & Visualization
- **Heatmap** hiển thị performance theo topic và keyword
- **Learning Portfolio** theo dõi tiến độ như investment portfolio
- **Statistics Dashboard** với metrics chi tiết
- **Time-based performance** tracking

### 🎨 UI/UX Features
- **Responsive Design** tối ưu cho mobile và desktop
- **Modern UI** với Tailwind CSS và Shadcn UI
- **Dark/Light mode** support
- **Smooth animations** và transitions
- **Accessibility** compliant

### 🔐 Authentication
- **User registration** và login system
- **Profile management** với achievements
- **Progress persistence** qua localStorage
- **Demo account** cho testing

## 🛠️ Tech Stack

### Frontend
- **React 18** với TypeScript
- **Vite** build tool
- **Tailwind CSS** cho styling
- **Shadcn UI** component library
- **Lucide React** icons
- **React Router** cho navigation

### State Management
- **React Context API** cho global state
- **useReducer** cho complex state logic
- **localStorage** cho data persistence

### Development Tools
- **TypeScript** cho type safety
- **ESLint** cho code quality
- **Prettier** cho code formatting

## 📁 Cấu trúc dự án

```
src/
├── components/          # UI Components
│   ├── ui/             # Shadcn UI components
│   ├── auth/           # Authentication components
│   └── Layout.tsx      # Main layout component
├── pages/              # Page components
│   ├── Home.tsx        # Dashboard
│   ├── Quiz.tsx        # Main quiz interface
│   ├── GCPQuiz.tsx     # GCP specific quiz
│   ├── Heatmap.tsx     # Performance visualization
│   ├── Portfolio.tsx   # Learning portfolio
│   ├── Guide.tsx       # Study guide
│   └── Profile.tsx     # User profile
├── contexts/           # React Context providers
│   ├── AppContext.tsx  # Quiz state management
│   └── AuthContext.tsx # Authentication state
├── data/               # Static data
│   └── gcpQuestions.ts # 302 GCP questions
├── types/              # TypeScript definitions
│   ├── index.ts        # Main types
│   └── auth.ts         # Auth types
├── lib/                # Utilities
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
└── main.tsx           # App entry point
```

## 🎯 Core Features

### 1. Quiz System
- **Question Types**: Radio và Checkbox
- **Topic Classification**: Compute, Storage, Networking, IAM, etc.
- **Keyword Extraction**: Tự động extract keywords từ câu hỏi
- **Answer Validation**: Smart validation cho cả single và multiple choice
- **Progress Persistence**: Lưu tiến độ qua localStorage

### 2. Analytics Dashboard
- **Performance Heatmap**: Visualize performance theo topic
- **Keyword Analysis**: Deep dive vào từng keyword
- **Time-based Tracking**: Theo dõi improvement theo thời gian
- **Learning Trends**: Identify strong và weak areas

### 3. User Experience
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions và micro-interactions
- **Accessibility**: ARIA labels và keyboard navigation
- **Performance**: Code splitting và lazy loading

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm hoặc yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd gcp-quiz-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📊 Data Structure

### Question Interface
```typescript
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  type: 'radio' | 'checkbox';
  topic?: string;
  keywords?: string[];
}
```

### User Answer Interface
```typescript
interface UserAnswer {
  questionId: number;
  selectedAnswer: string | string[];
  isCorrect: boolean;
  timestamp: Date;
}
```

## 🎨 UI Components

### Core Components
- **Card**: Flexible container component
- **Button**: Multiple variants và sizes
- **Badge**: Status và category indicators
- **Progress**: Progress bars và loading states
- **Modal**: Dialog và alert components

### Form Components
- **Input**: Text input fields
- **Select**: Dropdown selections
- **Checkbox**: Multiple choice inputs
- **RadioGroup**: Single choice inputs
- **Label**: Form labels

## 🔧 Configuration

### Vite Config
- **Code Splitting**: Manual chunks cho optimization
- **Alias**: Path mapping cho imports
- **Build Optimization**: Terser minification
- **Dev Server**: Hot reload và port configuration

### Tailwind Config
- **Custom Colors**: CSS variables cho theming
- **Custom Animations**: Keyframes cho micro-interactions
- **Responsive Breakpoints**: Mobile-first approach
- **Plugin Integration**: Tailwind animate plugin

## 📱 Mobile Optimization

### Responsive Features
- **Touch Targets**: Minimum 44px cho mobile
- **Safe Areas**: Support cho notch devices
- **Viewport Meta**: Proper mobile scaling
- **Gesture Support**: Touch-friendly interactions

### Performance
- **Lazy Loading**: Code splitting cho pages
- **Image Optimization**: WebP format support
- **Bundle Optimization**: Tree shaking và minification
- **Caching**: Service worker cho offline support

## 🔐 Security Features

### Authentication
- **Mock Auth**: Demo authentication system
- **Session Management**: localStorage persistence
- **Profile Protection**: Secure user data handling
- **Input Validation**: Form validation và sanitization

### Data Protection
- **localStorage**: Secure data storage
- **Input Sanitization**: XSS prevention
- **Type Safety**: TypeScript cho runtime safety
- **Error Handling**: Graceful error management

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview

# Analyze bundle
npm run analyze
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Container**: Docker deployment
- **Server**: Node.js server deployment

## 📈 Performance Metrics

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Bundle Analysis
- **Main Bundle**: < 500KB
- **Vendor Chunks**: Optimized splitting
- **CSS Size**: < 100KB
- **Image Assets**: WebP optimization

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component testing
- **Integration Tests**: User flow testing
- **E2E Tests**: Full application testing
- **Performance Tests**: Load testing

### Quality Assurance
- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit validation

## 🤝 Contributing

### Development Workflow
1. **Fork** repository
2. **Create** feature branch
3. **Implement** changes
4. **Test** thoroughly
5. **Submit** pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality rules
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standard commit messages

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Shadcn UI** cho component library
- **Tailwind CSS** cho styling framework
- **Lucide** cho icon set
- **React Team** cho amazing framework
- **Vite Team** cho fast build tool

---

**Made with ❤️ for GCP Learning Community** 