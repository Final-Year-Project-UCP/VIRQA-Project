/**
 * VIRQA Mock Test Server
 * Simulates all API endpoints 
 * Used exclusively for performance/load/stress/spike testing
 */
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

// Simulate realistic DB latency (5-30ms random)
const simulateLatency = (min = 5, max = 30) =>
  new Promise(resolve => setTimeout(resolve, min + Math.random() * (max - min)));

// Fake JWT token
const fakeToken = crypto.randomBytes(32).toString('hex');

// ============================================================
// ROOT
// ============================================================
app.get('/', (req, res) => {
  res.send('<h1>VIRQA Mock Test Server</h1>');
});

// ============================================================
// AUTH ROUTES - /api/v1/user
// ============================================================
app.post('/api/v1/user/register', async (req, res) => {
  await simulateLatency(20, 80);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { _id: crypto.randomUUID(), name: 'Test User', email: req.body.email || 'test@test.com', role: 'candidate' }
  });
});

app.post('/api/v1/user/login', async (req, res) => {
  await simulateLatency(15, 60);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { token: fakeToken, user: { _id: crypto.randomUUID(), name: 'Test User', role: 'candidate' } }
  });
});

app.post('/api/v1/user/logout', async (req, res) => {
  await simulateLatency(5, 15);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/v1/user/profile', async (req, res) => {
  await simulateLatency(10, 40);
  res.status(200).json({
    success: true,
    data: { _id: crypto.randomUUID(), name: 'Test User', email: 'test@test.com', role: 'candidate', profilePhoto: null }
  });
});

app.patch('/api/v1/user/profile', async (req, res) => {
  await simulateLatency(20, 60);
  res.status(200).json({ success: true, message: 'Profile updated' });
});

app.patch('/api/v1/user/change-password', async (req, res) => {
  await simulateLatency(15, 40);
  res.status(200).json({ success: true, message: 'Password changed' });
});

app.post('/api/v1/user/forgot-password', async (req, res) => {
  await simulateLatency(30, 100);
  res.status(200).json({ success: true, message: 'OTP sent to email' });
});

app.post('/api/v1/user/verify-otp', async (req, res) => {
  await simulateLatency(10, 30);
  res.status(200).json({ success: true, message: 'OTP verified' });
});

app.post('/api/v1/user/reset-password', async (req, res) => {
  await simulateLatency(15, 40);
  res.status(200).json({ success: true, message: 'Password reset successful' });
});

// ============================================================
// CANDIDATE ROUTES - /api/v1/candidate
// ============================================================
app.get('/api/v1/candidate/my-interviews', async (req, res) => {
  await simulateLatency(20, 60);
  const interviews = Array.from({ length: 5 }, (_, i) => ({
    _id: crypto.randomUUID(),
    title: `Interview ${i + 1}`,
    status: ['scheduled', 'completed', 'in-progress'][i % 3],
    scheduledAt: new Date().toISOString(),
    company: `Company ${i + 1}`
  }));
  res.status(200).json({ success: true, data: interviews });
});

app.patch('/api/v1/candidate/interview/:id/complete', async (req, res) => {
  await simulateLatency(15, 50);
  res.status(200).json({ success: true, message: 'Interview marked as completed' });
});

app.get('/api/v1/candidate/my-results', async (req, res) => {
  await simulateLatency(25, 70);
  const results = Array.from({ length: 3 }, (_, i) => ({
    _id: crypto.randomUUID(),
    interviewId: crypto.randomUUID(),
    score: Math.floor(Math.random() * 40) + 60,
    feedback: 'Good performance overall',
    technicalScore: Math.floor(Math.random() * 30) + 70,
    communicationScore: Math.floor(Math.random() * 30) + 65,
    createdAt: new Date().toISOString()
  }));
  res.status(200).json({ success: true, data: results });
});

// ============================================================
// AI INTERVIEW ROUTES - /api/v1/ai-interview
// ============================================================
app.post('/api/v1/ai-interview/start', async (req, res) => {
  await simulateLatency(50, 150); // AI init takes longer
  res.status(201).json({
    success: true,
    message: 'AI Interview started',
    data: {
      _id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      status: 'active',
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1}: Describe your experience with technology ${i + 1}`,
        category: ['Technical', 'Behavioral', 'Problem Solving', 'Leadership', 'Communication'][i]
      }))
    }
  });
});

app.get('/api/v1/ai-interview/:id', async (req, res) => {
  await simulateLatency(15, 45);
  res.status(200).json({
    success: true,
    data: {
      _id: req.params.id,
      status: 'active',
      currentQuestion: 2,
      totalQuestions: 5,
      answers: []
    }
  });
});

app.post('/api/v1/ai-interview/end', async (req, res) => {
  await simulateLatency(80, 200); // Evaluation takes time
  res.status(200).json({
    success: true,
    message: 'AI Interview completed',
    data: {
      score: Math.floor(Math.random() * 30) + 70,
      summary: 'Strong technical skills with good communication abilities.',
      recommendations: ['Continue developing leadership skills', 'Explore cloud architecture']
    }
  });
});

// ============================================================
// EMPLOYEE ROUTES - /api/v1/employee
// ============================================================
app.get('/api/v1/employee/dashboard', async (req, res) => {
  await simulateLatency(20, 50);
  res.status(200).json({
    success: true,
    data: {
      totalInterviews: 42,
      activeInterviews: 5,
      completedInterviews: 37,
      averageScore: 74.5,
      recentActivity: Array.from({ length: 10 }, (_, i) => ({
        action: `Interview ${i % 2 === 0 ? 'completed' : 'scheduled'}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString()
      }))
    }
  });
});

app.get('/api/v1/employee/interviews', async (req, res) => {
  await simulateLatency(25, 60);
  const interviews = Array.from({ length: 10 }, (_, i) => ({
    _id: crypto.randomUUID(),
    candidateName: `Candidate ${i + 1}`,
    position: ['Frontend Dev', 'Backend Dev', 'Full Stack', 'DevOps', 'QA'][i % 5],
    status: ['scheduled', 'in-progress', 'completed'][i % 3],
    score: i % 3 === 2 ? Math.floor(Math.random() * 30) + 70 : null,
    scheduledAt: new Date(Date.now() + i * 86400000).toISOString()
  }));
  res.status(200).json({ success: true, data: interviews });
});

app.post('/api/v1/employee/interview', async (req, res) => {
  await simulateLatency(30, 80);
  res.status(201).json({
    success: true,
    message: 'Interview created',
    data: { _id: crypto.randomUUID(), status: 'scheduled', ...req.body }
  });
});

// ============================================================
// ADMIN ROUTES - /api/v1/admin
// ============================================================
app.get('/api/v1/admin/stats', async (req, res) => {
  await simulateLatency(30, 80);
  res.status(200).json({
    success: true,
    data: {
      totalUsers: 1250,
      totalInterviews: 3400,
      activeSessions: 28,
      revenue: 45000,
      growthRate: 12.5
    }
  });
});

app.get('/api/v1/admin/users', async (req, res) => {
  await simulateLatency(25, 70);
  const users = Array.from({ length: 20 }, (_, i) => ({
    _id: crypto.randomUUID(),
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'employee' : 'candidate',
    isActive: Math.random() > 0.2,
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));
  res.status(200).json({ success: true, data: users, total: 1250, page: 1, pages: 63 });
});

// ============================================================
// NOTIFICATION ROUTES - /api/v1/notifications
// ============================================================
app.get('/api/v1/notifications', async (req, res) => {
  await simulateLatency(10, 30);
  const notifications = Array.from({ length: 8 }, (_, i) => ({
    _id: crypto.randomUUID(),
    title: `Notification ${i + 1}`,
    message: `This is notification message ${i + 1}`,
    read: i > 3,
    type: ['interview', 'result', 'system', 'reminder'][i % 4],
    createdAt: new Date(Date.now() - i * 1800000).toISOString()
  }));
  res.status(200).json({ success: true, data: notifications });
});

app.patch('/api/v1/notifications/:id/read', async (req, res) => {
  await simulateLatency(5, 15);
  res.status(200).json({ success: true, message: 'Notification marked as read' });
});

// ============================================================
// FEEDBACK ROUTES - /api/v1/feedback
// ============================================================
app.post('/api/v1/feedback', async (req, res) => {
  await simulateLatency(15, 40);
  res.status(201).json({ success: true, message: 'Feedback submitted', data: { _id: crypto.randomUUID(), ...req.body } });
});

app.get('/api/v1/feedback', async (req, res) => {
  await simulateLatency(15, 45);
  const feedback = Array.from({ length: 5 }, (_, i) => ({
    _id: crypto.randomUUID(),
    rating: Math.floor(Math.random() * 2) + 4,
    comment: `Feedback comment ${i + 1}`,
    user: `User ${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));
  res.status(200).json({ success: true, data: feedback });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Start server
const PORT = process.env.TEST_PORT || 9090;
const server = app.listen(PORT, () => {
  console.log(`[MOCK SERVER] VIRQA Test Server running on http://localhost:${PORT}`);
  console.log(`[MOCK SERVER] All API endpoints simulated with realistic latency`);
});

export default server;
