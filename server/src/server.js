import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { connectDB, isDBConnected } from './db/connection.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

// Socket.io initialization with CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN === '*' ? '*' : CLIENT_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Middleware
app.use(cors({
  origin: CLIENT_ORIGIN === '*' ? '*' : CLIENT_ORIGIN.split(','),
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Attach Socket.io instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'JanSetu CRUD & Socket.io Server (SIH PS 76)',
    node_env: process.env.NODE_ENV || 'production',
    port: PORT,
    database_connected: isDBConnected(),
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// WebSocket Connection Events
io.on('connection', (socket) => {
  console.log('⚡ Client connected to Socket.io:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server & Connect MongoDB
server.listen(PORT, HOST, async () => {
  console.log(`🚀 Production Server running at http://${HOST}:${PORT}`);
  console.log(`🔗 REST API Base: http://${HOST}:${PORT}/api`);
  console.log(`📡 AI Service URL: ${process.env.AI_SERVICE_URL || 'http://localhost:4000'}`);
  await connectDB();
});

// Graceful Shutdown Handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received: Closing HTTP & Socket server');
  server.close(() => {
    console.log('Server successfully terminated');
  });
});
