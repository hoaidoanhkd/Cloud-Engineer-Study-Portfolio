/**
 * Demo user data for testing authentication system
 */

// Create demo user if doesn't exist
export function createDemoUser() {
  const savedUsers = JSON.parse(localStorage.getItem('gcp_users') || '[]');
  
  const demoUser = {
    id: 'demo-user-1',
    email: 'demo@gcp.com',
    name: 'Demo User',
    password: 'demo123',
    avatar: 'https://pub-cdn.sider.ai/u/U005H3JLKO4/web-coder/688b04f2088b7577affe1214/resource/c549f932-c87e-4a20-9b19-33d799951b62.jpg',
    joinDate: new Date('2025-01-01'),
    totalQuizzes: 5,
    totalCorrect: 23,
    totalTime: 45,
    level: 2,
    xp: 150,
    streak: 3,
    achievements: [
      '🎓 Welcome to GCP Learning!',
      '🔥 First Quiz Completed',
      '⚡ 3-Day Streak'
    ],
  };

  // Only add if doesn't exist
  const existingUser = savedUsers.find((u: any) => u.email === demoUser.email);
  if (!existingUser) {
    savedUsers.push(demoUser);
    localStorage.setItem('gcp_users', JSON.stringify(savedUsers));
  }
}

// Initialize demo user on app load
createDemoUser();
