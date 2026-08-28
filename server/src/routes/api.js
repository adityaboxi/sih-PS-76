import express from 'express';
import {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievanceStatus,
  rerouteGrievance,
  getAnalytics
} from '../controllers/grievanceController.js';
import { getDepartments } from '../controllers/departmentController.js';
import { chatWithAssistant } from '../controllers/chatController.js';
import { requestOtp, verifyOtpAndLogin } from '../controllers/authController.js';

const router = express.Router();

// Grievances CRUD & Re-routing
router.post('/grievances', createGrievance);
router.get('/grievances', getGrievances);
router.get('/grievances/analytics', getAnalytics);
router.get('/grievances/:id', getGrievanceById);
router.patch('/grievances/:id/status', updateGrievanceStatus);
router.post('/grievances/:id/reroute', rerouteGrievance);

// Departments
router.get('/departments', getDepartments);

// Conversational RAG Chat
router.post('/chat', chatWithAssistant);

// Auth & Role Switcher
router.post('/auth/otp', requestOtp);
router.post('/auth/login', verifyOtpAndLogin);

export default router;
