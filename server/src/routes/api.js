import express from 'express';
import {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievanceStatus,
  getAnalytics
} from '../controllers/grievanceController.js';
import { handleChat } from '../controllers/chatController.js';
import { getDepartments } from '../controllers/departmentController.js';

const router = express.Router();

// Grievance Endpoints
router.post('/grievances', createGrievance);
router.get('/grievances', getGrievances);
router.get('/grievances/analytics', getAnalytics);
router.get('/grievances/:id', getGrievanceById);
router.patch('/grievances/:id/status', updateGrievanceStatus);

// Departments
router.get('/departments', getDepartments);

// Conversational RAG Chat
router.post('/chat', handleChat);

export default router;
