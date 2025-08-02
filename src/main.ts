import { QuizManager } from './utils/quiz-manager.ts';
import { StorageManager } from './utils/storage.ts';
import type { QuizMode } from './types/quiz.ts';

// Initialize the quiz manager
const quizManager = new QuizManager();

// DOM elements
const statsSection = document.getElementById('stats-section');
const headerStats = document.getElementById('header-stats');
const recentActivity = document.getElementById('recent-activity');
const continueSession = document.getElementById('continue-session');
const sessionInfo = document.getElementById('session-info');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  checkForExistingSession();
});

function initializeApp() {
  // Load and display stats
  displayHeaderStats();
  displayQuickStats();
  displayRecentActivity();
  
  // Initialize theme
  initializeTheme();
}

function setupEventListeners() {
  // Quiz mode buttons
  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      const mode = target.getAttribute('data-mode') as QuizMode;
      if (mode) {
        startQuizMode(mode);
      }
    });
  });

  // Quick action buttons
  document.getElementById('view-bookmarks')?.addEventListener('click', viewBookmarks);
  document.getElementById('view-stats')?.addEventListener('click', viewDetailedStats);
  document.getElementById('export-data')?.addEventListener('click', exportData);
  document.getElementById('settings')?.addEventListener('click', openSettings);

  // Continue session buttons
  document.getElementById('continue-btn')?.addEventListener('click', continueExistingSession);
  document.getElementById('new-session-btn')?.addEventListener('click', startNewSession);
}

function displayHeaderStats() {
  if (!headerStats) return;
  
  const stats = StorageManager.getStats();
  const totalQuestions = stats.totalQuestions || 0;
  const accuracy = totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
  
  headerStats.innerHTML = `
    <div class="stat-item">
      <span class="stat-value">${totalQuestions}</span>
      <span class="stat-label">Questions Answered</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${accuracy}%</span>
      <span class="stat-label">Overall Accuracy</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${stats.recentSessions.length}</span>
      <span class="stat-label">Sessions Completed</span>
    </div>
  `;
}

function displayQuickStats() {
  if (!statsSection) return;
  
  const stats = StorageManager.getStats();
  const bookmarks = StorageManager.getBookmarkedQuestions();
  
  statsSection.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>${stats.totalQuestions}</h3>
          <p>Total Questions</p>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>${stats.correctAnswers}</h3>
          <p>Correct Answers</p>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <h3>${bookmarks.length}</h3>
          <p>Bookmarked</p>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <h3>${Math.round((stats.correctAnswers / Math.max(stats.totalQuestions, 1)) * 100)}%</h3>
          <p>Accuracy</p>
        </div>
      </div>
    </div>
  `;
}

function displayRecentActivity() {
  if (!recentActivity) return;
  
  const sessions = StorageManager.getSessions().slice(-5).reverse();
  
  if (sessions.length === 0) {
    recentActivity.innerHTML = `
      <div class="no-activity card">
        <p>No recent activity. Start your first quiz to see your progress here!</p>
      </div>
    `;
    return;
  }

  recentActivity.innerHTML = sessions.map(session => `
    <div class="activity-item card">
      <div class="activity-info">
        <h4>${session.mode.charAt(0).toUpperCase() + session.mode.slice(1)} Mode</h4>
        <p>${session.questions.length} questions • ${Math.round(session.score || 0)}% score</p>
        <small>${new Date(session.startTime).toLocaleDateString()}</small>
      </div>
      <div class="activity-score ${(session.score || 0) >= 70 ? 'good' : 'needs-improvement'}">
        ${Math.round(session.score || 0)}%
      </div>
    </div>
  `).join('');
}

function checkForExistingSession() {
  const currentSession = StorageManager.getCurrentSession();
  if (currentSession && !currentSession.isCompleted && continueSession && sessionInfo) {
    const progress = (currentSession.currentQuestionIndex / currentSession.questions.length) * 100;
    
    sessionInfo.innerHTML = `
      <div class="session-details">
        <p><strong>Mode:</strong> ${currentSession.mode.charAt(0).toUpperCase() + currentSession.mode.slice(1)}</p>
        <p><strong>Progress:</strong> ${currentSession.currentQuestionIndex + 1}/${currentSession.questions.length} questions</p>
        <p><strong>Started:</strong> ${new Date(currentSession.startTime).toLocaleString()}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
    `;
    
    continueSession.style.display = 'block';
  }
}

function startQuizMode(mode: QuizMode) {
  // For now, just show an alert - in a full implementation this would navigate to the quiz interface
  alert(`Starting ${mode} mode! This would navigate to the quiz interface.`);
  
  // Example of starting a session (commented out as it needs proper quiz interface)
  // const session = quizManager.startNewSession(mode, {
  //   questionsCount: 50,
  //   randomize: true
  // });
  // window.location.href = '/quiz.html';
}

function continueExistingSession() {
  const session = quizManager.resumeSession();
  if (session) {
    alert('Continuing existing session! This would navigate to the quiz interface.');
    // window.location.href = '/quiz.html';
  }
}

function startNewSession() {
  StorageManager.clearCurrentSession();
  if (continueSession) {
    continueSession.style.display = 'none';
  }
}

function viewBookmarks() {
  const bookmarks = StorageManager.getBookmarkedQuestions();
  alert(`You have ${bookmarks.length} bookmarked questions. This would open the bookmarks view.`);
}

function viewDetailedStats() {
  const stats = quizManager.getDetailedStats();
  console.log('Detailed stats:', stats);
  alert('Opening detailed statistics view...');
}

function exportData() {
  try {
    const stats = StorageManager.getStats();
    const sessions = StorageManager.getSessions();
    const bookmarks = StorageManager.getBookmarkedQuestions();
    
    const exportData = {
      stats,
      sessions,
      bookmarks,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `gcp-quiz-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export data. Please try again.');
  }
}

function openSettings() {
  alert('Settings panel would open here. This would show theme, notification, and quiz preferences.');
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'auto';
  const themeToggleContainer = document.getElementById('theme-toggle-container');
  
  if (themeToggleContainer) {
    themeToggleContainer.innerHTML = `
      <button id="theme-toggle" class="theme-toggle" title="Toggle theme">
        <span class="theme-icon">🌓</span>
      </button>
    `;
    
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', toggleTheme);
  }
  
  applyTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

function applyTheme(theme: string) {
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  
  document.documentElement.setAttribute('data-theme', theme);
}