import type { NotificationConfig } from '../types/quiz.ts';

export class UIComponents {
  // Notification System
  static showNotification(config: NotificationConfig): void {
    const notification = document.createElement('div');
    notification.className = `notification ${config.type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${config.message}</span>
        ${config.action ? `<button class="notification-action">${config.action.label}</button>` : ''}
        <button class="notification-close" aria-label="Close">&times;</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Handle action button
    if (config.action) {
      const actionBtn = notification.querySelector('.notification-action') as HTMLButtonElement;
      actionBtn?.addEventListener('click', () => {
        config.action!.callback();
        this.hideNotification(notification);
      });
    }

    // Handle close button
    const closeBtn = notification.querySelector('.notification-close') as HTMLButtonElement;
    closeBtn?.addEventListener('click', () => this.hideNotification(notification));

    // Auto hide
    const duration = config.duration || 5000;
    setTimeout(() => this.hideNotification(notification), duration);
  }

  private static hideNotification(notification: HTMLElement): void {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Modal System
  static createModal(title: string, content: string, actions: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }> = []): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          ${actions.map(action => 
            `<button class="btn btn-${action.variant || 'secondary'}" data-action="${action.label}">
              ${action.label}
            </button>`
          ).join('')}
        </div>
      </div>
    `;

    // Handle actions
    actions.forEach(action => {
      const btn = modal.querySelector(`[data-action="${action.label}"]`) as HTMLButtonElement;
      btn?.addEventListener('click', () => {
        action.action();
        this.hideModal(modal);
      });
    });

    // Handle close button
    const closeBtn = modal.querySelector('.modal-close') as HTMLButtonElement;
    closeBtn?.addEventListener('click', () => this.hideModal(modal));

    // Handle overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideModal(modal);
      }
    });

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);

    return modal;
  }

  private static hideModal(modal: HTMLElement): void {
    modal.classList.remove('show');
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }

  // Progress Bar Component
  static createProgressBar(container: HTMLElement, progress: {
    current: number;
    total: number;
    percentage: number;
  }): void {
    container.innerHTML = `
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress.percentage}%"></div>
        </div>
        <div class="progress-text">
          <span>Question ${progress.current} of ${progress.total}</span>
          <span>${Math.round(progress.percentage)}%</span>
        </div>
      </div>
    `;
  }

  // Timer Component
  static createTimer(container: HTMLElement, timeRemaining: number | null): void {
    if (timeRemaining === null) {
      container.innerHTML = '';
      return;
    }

    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    let timerClass = 'timer';
    if (timeRemaining < 300000) timerClass += ' warning'; // 5 minutes
    if (timeRemaining < 60000) timerClass += ' danger'; // 1 minute

    container.innerHTML = `
      <div class="${timerClass}">
        <span class="timer-icon">⏱️</span>
        <span class="timer-text">${timeString}</span>
      </div>
    `;
  }

  // Theme Toggle Component
  static createThemeToggle(container: HTMLElement, currentTheme: 'light' | 'dark' | 'auto'): void {
    const icons = {
      light: '☀️',
      dark: '🌙',
      auto: '🌓'
    };

    container.innerHTML = `
      <button class="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
        ${icons[currentTheme]}
      </button>
    `;

    const button = container.querySelector('.theme-toggle') as HTMLButtonElement;
    button?.addEventListener('click', () => {
      const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
      const currentIndex = themes.indexOf(currentTheme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      
      this.applyTheme(nextTheme);
      this.createThemeToggle(container, nextTheme);
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: nextTheme }));
    });
  }

  static applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }

  // Search Component
  static createSearchBox(container: HTMLElement, placeholder: string = 'Search questions...'): HTMLInputElement {
    container.innerHTML = `
      <div class="search-container">
        <input type="text" class="search-input" placeholder="${placeholder}">
        <span class="search-icon">🔍</span>
      </div>
    `;

    return container.querySelector('.search-input') as HTMLInputElement;
  }

  // Filter Component
  static createFilter(container: HTMLElement, options: {
    categories: string[];
    difficulties: string[];
    selectedCategories: string[];
    selectedDifficulties: string[];
  }): void {
    container.innerHTML = `
      <div class="filter-container">
        <div class="filter-section">
          <h4>Categories</h4>
          <div class="filter-options">
            ${options.categories.map(category => `
              <label class="filter-option">
                <input type="checkbox" value="${category}" 
                       ${options.selectedCategories.includes(category) ? 'checked' : ''}>
                <span>${category}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="filter-section">
          <h4>Difficulty</h4>
          <div class="filter-options">
            ${options.difficulties.map(difficulty => `
              <label class="filter-option">
                <input type="checkbox" value="${difficulty}"
                       ${options.selectedDifficulties.includes(difficulty) ? 'checked' : ''}>
                <span>${difficulty}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Question Card Component
  static createQuestionCard(question: any, options: {
    showNumber?: boolean;
    showBookmark?: boolean;
    showExplanation?: boolean;
    selectedAnswer?: string;
    correctAnswer?: string;
    isBookmarked?: boolean;
  } = {}): HTMLElement {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-header">
        ${options.showNumber ? `<div class="question-number">Question ${question.questionNumber}</div>` : ''}
        ${options.showBookmark ? `
          <button class="bookmark-btn ${options.isBookmarked ? 'bookmarked' : ''}" 
                  data-question-id="${question.id}" 
                  aria-label="Bookmark question">
            ${options.isBookmarked ? '★' : '☆'}
          </button>
        ` : ''}
      </div>
      <div class="question-text">${question.text}</div>
      <div class="question-options">
        ${question.options.map((option: any) => {
          let optionClass = 'option';
          if (options.selectedAnswer === option.id) optionClass += ' selected';
          if (options.correctAnswer && option.isCorrect) optionClass += ' correct';
          if (options.selectedAnswer === option.id && !option.isCorrect) optionClass += ' incorrect';
          
          return `
            <div class="${optionClass}" data-option-id="${option.id}">
              <input type="radio" name="question-${question.id}" value="${option.id}" 
                     id="option-${question.id}-${option.id}" class="option-input"
                     ${options.selectedAnswer === option.id ? 'checked' : ''}>
              <label for="option-${question.id}-${option.id}" class="option-text">
                ${option.text}
              </label>
            </div>
          `;
        }).join('')}
      </div>
      ${options.showExplanation && question.explanation ? `
        <div class="question-explanation">
          <h5>Explanation:</h5>
          <p>${question.explanation}</p>
        </div>
      ` : ''}
    `;

    return card;
  }

  // Loading Spinner Component
  static createLoadingSpinner(container: HTMLElement, message: string = 'Loading...'): void {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading"></div>
        <p class="loading-message">${message}</p>
      </div>
    `;
  }

  // Stats Card Component
  static createStatsCard(title: string, stats: Array<{ label: string; value: string | number; color?: string }>): HTMLElement {
    const card = document.createElement('div');
    card.className = 'stats-card card';
    card.innerHTML = `
      <h3 class="stats-title">${title}</h3>
      <div class="stats-grid">
        ${stats.map(stat => `
          <div class="stat-item">
            <div class="stat-value" ${stat.color ? `style="color: ${stat.color}"` : ''}>${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
          </div>
        `).join('')}
      </div>
    `;
    return card;
  }

  // Confirmation Dialog
  static showConfirmDialog(message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.createModal('Confirm Action', message, [
      {
        label: 'Cancel',
        action: onCancel || (() => {}),
        variant: 'secondary'
      },
      {
        label: 'Confirm',
        action: onConfirm,
        variant: 'primary'
      }
    ]);
  }

  // Toast Notifications (Quick Messages)
  static showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    this.showNotification({
      type,
      message,
      duration: 3000
    });
  }

  // Utility: Format Time
  static formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Utility: Format Date
  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Utility: Animate Element
  static animateElement(element: HTMLElement, animation: string, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.animation = `${animation} ${duration}ms ease`;
      setTimeout(() => {
        element.style.animation = '';
        resolve();
      }, duration);
    });
  }
}